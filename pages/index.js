/**
 * Landing Page
 * - Nav bar
 * - Main content area showing the post feed
 * - Sidebar with navigation options
 */

import Main from "../components/LandingPage/Main"
import Navbar from "../components/Navbar"

export default function HomePage() {
  return (
    <>
      <Navbar/>
      <Main/>
    </>
  );
}
