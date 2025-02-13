import { useState } from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #2b2b4b;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  outline: none;
`;

const SearchButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #0056b3;
  }
`;

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const [username, usertag] = query.split("#");
    if (username && usertag) {
      onSearch(username, usertag);
    } 
    
    else {
      alert("Please enter in the format: name#tag");
    }

  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Enter Name#Tag (e.g., nat#777)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <SearchButton onClick={handleSearch}>🔍</SearchButton>
    </SearchContainer>
  );
}
