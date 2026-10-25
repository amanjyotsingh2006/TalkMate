import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotificationPage from "./pages/NotificationPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";

import Layout from "./components/Layout";
import PageLoader from "./components/PageLoader";

import useAuthUser from "./hooks/useAuthUser";
import { useThemeStore } from "./Store/useThemeStore";
import FriendsPage from "./pages/FriendPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import FileViewer from "./pages/FileViewer";
import LandingPage from "./pages/landingPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/landing"
          element={
            isAuthenticated && isOnboarded ? (
              <Navigate to="/" replace />
            ) : (
              <LandingPage />
            )
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar>
                <HomePage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignupPage />
            ) : (
              <Navigate
                to={isOnboarded ? "/" : "/onboarding"}
                replace
              />
            )
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate
                to={isOnboarded ? "/" : "/onboarding"}
                replace
              />
            )
          }
        />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />

        <Route
          path="/notification"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar>
                <NotificationPage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar>
                <ProfilePage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />

        <Route
          path="/profile/edit"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar>
                <EditProfilePage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
              />
            )
          }
        />

        <Route path="/file-viewer" element={<FileViewer />} />

      </Routes>



      <Toaster position="top-right" />
    </div>
  );
};

export default App;