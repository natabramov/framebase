import { usePlayerStats } from "../hooks/usePlayerStats";
import SearchBar from "../components/SearchBar";
import styled from "styled-components";
import Hero from "../components/LandingPage/Hero"
import NavBar from "@components/Dashboard/Navbar";

export default function HomePage() {
  return (
    <>
      <NavBar/>
      <Hero/>
    </>
  );
}
