
import './App.css'
import AddBook from './Book pages/AddBook'
import Login from "./Login&Register/Login"
import Layout from './Layout/Layout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AllBook from './Book pages/AllBook'
import MyBook from './Book pages/MyBook'
import Profile from './Book pages/Profile'
import Register from "./Login&Register/Register"
import RequestBook from './Book pages/RequestBook'
import AdminDashboard from './Book pages/AdminDashBoard'
import ExchangeDetails from './Book pages/ExchangeDetails'
import MyRequests from './Book pages/MyRequests'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login></Login>,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/admindash",
      element: <AdminDashboard></AdminDashboard>
    },
    {
      path: "/home",
      element: <Layout></Layout>,
      children: [
        {
          path: "requestbook",
          element: <RequestBook></RequestBook>
        },
        {
          path: "allbook",
          element: <AllBook></AllBook>
        },
        {
          path: "mybook",
          element: <MyBook></MyBook>
        },
        {
          path: "addbook",
          element: <AddBook></AddBook>
        },
        {
          path: "profile",
          element: <Profile></Profile>
        },
        {
          path: "exchange/:requestId",
          element: <ExchangeDetails />
        },
        {
          path: "myrequests",
          element: <MyRequests />
        },
      ]
    }
  ])

  return (

    <RouterProvider router={router} />

  )
}

export default App
