import { usePlayerStats } from "../hooks/usePlayerStats";
import SearchBar from "../components/SearchBar";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

export default function StatisticsPage() {
  const { playerData, fetchPlayerStats, error } = usePlayerStats();

  return (
    <PageContainer>
      <h1>Player Stats Tracker</h1>
      <SearchBar onSearch={fetchPlayerStats} />

      {error && <p>Error: {error}</p>}
      {playerData && (
        <div>
          <h2>{playerData.gameName}#{playerData.tagLine}</h2>
          <pre>{JSON.stringify(playerData, null, 2)}</pre>
        </div>
      )}
    </PageContainer>
  );
}
