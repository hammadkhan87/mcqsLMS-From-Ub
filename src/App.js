import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import LoadingScreen from "./pages/LoadingScreen/LoadingScreen";
import Navbar from "./components/Header/Navbar";
import Footer from "./components/Footer/Footer";
import SelfStudy from "./pages/SelfStudy/SelfStudy";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import addArrayToFirestore from "./generator";
import Lost from "./pages/Lost/Lost";
import Explore from "./components/ClassRoom/Explore/Explore";
import MyLibrary from "./components/ClassRoom/MyLibrary/MyLibrary";
import CreateQuiz from "./components/ClassRoom/CreateQuiz/CreateQuiz";
import Class from "./components/ClassRoom/Class/Class";
import SelfStudyC from "./components/ClassRoom/SelfStudy/SelfStudy";
import CodeRoom from "./components/ClassRoom/CodeRoom/CodeRoom";
import Settings from "./components/ClassRoom/Settings/Settings";
import SearchQuiz from "./components/ClassRoom/Explore/SearchQuiz/SearchQuiz";
import { useNavigation } from "react-router-dom";
import StudentPortal from "./pages/Studentportal/StudentPortal";
import { onAuthStateChanged } from "firebase/auth";
import StudentPortalB from "./components/StudentPortal/StudentPortal";
import { auth } from "./firebase";
// import SingleClass from "./components/ClassRoom/Class/SingleClass/SingleClass";
import SelfGround from "./pages/SelfGround/SelfGround";
import SelfPlay from "./pages/SelfPlay/SelfPlay";
import CreatedByMe from "./components/ClassRoom/MyLibrary/CreatedByMe/CreatedByMe";
import Important from "./components/ClassRoom/MyLibrary/Important/Important";
import Liked from "./components/ClassRoom/MyLibrary/Liked/Liked";
import All from "./components/ClassRoom/MyLibrary/All/All";
import Folder from "./components/ClassRoom/MyLibrary/Folder/Folder";
import Saved from "./components/ClassRoom/MyLibrary/Saved/Saved";
import SearchQuizb from "./pages/SearchQuiz/SearchQuiz";
import SelfStudyStudent from "./components/ClassRoom/SelfStudy/SelfStudyStudent/SelfStudyStudent";
import Result from "./components/SelfPlay2/Result/Result";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import PrimarySearchAppBar from "./components/PrimarySearvhAppBar/PrimarySearchAppBar";
import HomePage from "./pages/HomePage/HomePage";
import ClassRoomSearch from "./components/ClassRoom/Explore/SearchQuiz/SearchQuiz";
import CodeRoomStudents from "./components/ClassRoom/CodeRoom/CodeRoomStudents/CodeRoomStudents";
import { Toaster } from "react-hot-toast";
import ADminDashboard from "./components/Admin/Dashboard"
import StudentCodeRoom from "./pages/StudentCodeRoom/StudentCodeRoom";
import SingleClass from "./components/ClassRoom/Class/SingleClass/SingleClass";
import StudentClass from "./components/StudentPortal/StudentClass/StudentClass";
import TeacherClassroomResult from "./components/ClassRoom/Class/SingleClass/ClassQuizzes/Passed/TeacherClasssroomResult/TeacherClasssroomResult"
// const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const CoursesList = lazy(() => import("./pages/CoursesList/CoursesList"));
const ClassRoom = lazy(() => import("./pages/ClassRoom/ClassRoom"));
function App() {
  const [role, setRole] = useState("");
  const [isLogin, setIsLogin] = useState("");
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  console.log(role);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setRole(parsedData.role);
      setIsLogin(parsedData.name);
    } else {
      setRole("user");
      setIsLogin("");
    }
  }, []);
  return (
    <>
      <Toaster />
      {role === "Student" && (
        <PrimarySearchAppBar
          role={role}
          isLogin={isLogin}
          placement={placement}
          onChange={onChange}
          showDrawer={showDrawer}
        />
      )}
      {role === "user" && (
        <PrimarySearchAppBar
          role={role}
          isLogin={isLogin}
          placement={placement}
          onChange={onChange}
          showDrawer={showDrawer}
        />
      )}
      {role === "Admin" && (
        <PrimarySearchAppBar
          role={role}
          isLogin={isLogin}
          placement={placement}
          onChange={onChange}
          showDrawer={showDrawer}
        />
      )}
      {/* <Navbar
        role={role}
        isLogin={isLogin}
        placement={placement}
        onChange={onChange}
        showDrawer={showDrawer}
      /> */}

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/">
            <Route index element={<HomePage />} />
            <Route path="student-coderoom/:id" element={<StudentCodeRoom />} />
            <Route path="courselist/:id" element={<CoursesList />} />
            <Route
              path="selfstudy"
              element={<SelfStudy isLogin={isLogin} />}
            ></Route>
            <Route path="selfstudy/ground/:id/:name" element={<SelfGround />} />
            <Route path="selfstudy/ground/play/:id/:name" element={<SelfPlay />} />
            <Route
              path="selfstudy/ground/play/:id/:name/result"
              element={<Result />}
            />

            {(role === "Teacher" || role === "Admin") && (
              <Route
                path="classroom"
                element={
                  <ClassRoom
                    placement={placement}
                    onChange={onChange}
                    onClose={onClose}
                    open={open}
                    showDrawer={showDrawer}
                  />
                }
              >
                <Route path="explore" element={<Explore  showDrawer={showDrawer} />} />
                <Route
                  path="explore/self-search-quiz"
                  element={<ClassRoomSearch showDrawer={showDrawer}/>}
                />
                <Route path="library" element={<MyLibrary showDrawer={showDrawer} />}>
                  <Route index />
                  <Route exact path="created-by-me" element={<CreatedByMe />} />
                  <Route exact path="saved" element={<Saved />} />
                  <Route exact path="important" element={<Important />} />
                  <Route exact path="liked" element={<Liked />} />
                  <Route exact path="all" element={<All />} />
                  <Route exact path="*" element={<Folder />} />
                </Route>
                <Route path="create" element={<CreateQuiz showDrawer={showDrawer} />} />
                <Route path="class" element={<Class showDrawer={showDrawer} />} />
                <Route
                  path="class/class-Singleclass"
                  element={<SingleClass showDrawer={showDrawer} />}
                />
                <Route path = "class/class-Singleclass/teacher-classroom-result" element ={<TeacherClassroomResult/>} ></Route>
                <Route path="self-study" element={<SelfStudyC showDrawer={showDrawer} />} />
                <Route
                  path="self-study/users/:id"
                  element={<SelfStudyStudent />} 
                />
                <Route path="code-room">
                  <Route index element={<CodeRoom showDrawer={showDrawer} />} />
                  <Route path=":id" element={<CodeRoomStudents showDrawer={showDrawer} />} />
                </Route>
                <Route path="settings" element={<Settings showDrawer={showDrawer} />} />
              </Route>
            )}
            <Route
              path="student-classes/student-class"
              element={<StudentClass />}
            />
            {/* <Route path="/admin-dashboard" element={<Dashboard />} /> */}
            <Route path="/self-search-quiz" element={<SearchQuizb />} />
            <Route path="/admin-dashboard" element={<ADminDashboard/>} />
            <Route path="/student-classes" element={<StudentPortalB />} />
            <Route path="/admin-create-quiz" exact element={<CreateQuiz />} />
            <Route path="/student-portal" exact element={<StudentPortal />} />
            <Route path="self-search-quiz" element={<SearchQuizb />} />
            <Route path="classroom/search" element={<SearchQuiz />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgetpassword" element={<ForgetPassword />} />
            <Route path="*" element={<Lost />} />
          </Route>
        </Routes>
      </Suspense>

      <Footer />
    </>
  );
}

export default App;
