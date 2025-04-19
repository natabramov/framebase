import styled from 'styled-components';
import Post from '../components/LandingPage/Post';
import Navbar from "../components/Navbar"
import Sidebar from '../components/LandingPage/Sidebar';

export default function SearchPage() {
  return (
    <>
     <Navbar/>
     <Sidebar/>
    <Container>
      <Grid>
        <GridItem>
        <Post
          username="username"
          caption="tyrol, austria"
          image="/posts/austria.jpg"
        />
        </GridItem>
        <GridItem>
        <Post
          username="username"
          caption="munich, germany"
          image="/posts/munich.jpg"
        />
        </GridItem>
        <GridItem>
        <Post
          username="username"
          caption="casablanca, morocco"
          image="/posts/casablanca.jpg"
        />
        </GridItem>
      </Grid>
    </Container>
    </>
  );
}

const Container = styled.div`
  padding: 80px 40px;
  background-color:rgb(239, 239, 239);
  min-height: 100vh;
  margin-left: 220px;

  @media (max-width: 1200px) {
    margin-left: 70px;
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`;

// puts correct whitespace on different photosizes
const GridItem = styled.div`
  flex: 1 1 300px;
  min-width: 300px;
`;

