import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js"
import { streamClient } from "../db/stream.js";

export async function getRecommendedUser(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUser = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, //Excludes Current User
                { _id: { $nin: currentUser.friends } }, //Excludes Current User friends
                { isOnboarded: true }
            ]
        })

        res.status(200).json(recommendedUser);
    } catch (error) {
        console.log("Error in getRecommendedUser controller", error.message);

        res.status(500).json({ message: "Internal Server Error" })
    }
}



export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).select("friends").populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.log("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}



export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id
        const { id: recipientId } = req.params

        if (myId === recipientId) {
            return res.status(400).json({ message: "You can't send friend request to yourself" })
        }

        const recipient = await User.findById(recipientId)
        if (!recipient) {
            return res.status(400).json({ message: "Recipient not found" })
        }

        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friend with this user" })
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A friend request already exist between you and this user" })
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        })

        res.status(201).json(friendRequest);
    } catch (error) {
        console.log("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}



export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({ success: true, message: "Friend request accepted" });
    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



export async function getFriendRequests(req, res) {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({ incomingRequests, acceptedRequests });
    } catch (error) {
        console.log("Error in getFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage")

        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.log("Error in getOutgoingFriendRequest", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const { profilePic, fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                profilePic,
                fullName,
                bio,
                nativeLanguage,
                learningLanguage,
                location
            }
        )

        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ message: "Profile updated Successfully", user })
    } catch (error) {
        res.status(500).json({ message: "Failed to update Profile" })
        console.error("Error in updateProfile controller", error.message)
    }
}



export async function getProfileStats(req, res) {
    try {
        const userId = req.user._id.toString();

        const channels = await streamClient.queryChannels(
            { type: "messaging", members: { $in: [userId] } },
            {},
            { limit: 100 }
        );

        // Only count chats that actually have messages
        const conversations = channels.filter(
            (c) => c.state.messages.length > 0
        ).length;

        const user = await User.findById(userId).select("practiceSeconds");

        res.status(200).json({
            conversations,
            practiceSeconds: user?.practiceSeconds || 0,
        });
    } catch (error) {
        console.log("Error in getProfileStats controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function addPracticeTime(req, res) {
    try {
        // Clamp to 0 - 6 hours so a bad request can't inflate the total
        const seconds = Math.max(0, Math.min(Number(req.body.seconds) || 0, 6 * 3600));

        await User.findByIdAndUpdate(req.user._id, {
            $inc: { practiceSeconds: seconds },
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.log("Error in addPracticeTime controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}