import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  TextField,
  Typography,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import axios from "axios";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [champions, setChampions] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [name, setName] = useState('');
  const [selectedChampions, setSelectedChampions] = useState({});

  const fetchChampions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://ddragon.leagueoflegends.com/cdn/13.18.1/data/en_US/champion.json'
      );
      const { data } = response.data;
      const championNames = Object.keys(data);
      setChampions(championNames);
    } catch (error) {
      setError("Erro ao buscar informações.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChampions();

    // Carregar jogadores salvos do localStorage
    const storedTeamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    setTeamMembers(storedTeamMembers);
  }, []);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (teamMembers.length < 5 && name) {
      const updatedTeamMembers = [...teamMembers, name];
      setTeamMembers(updatedTeamMembers);
      localStorage.setItem('teamMembers', JSON.stringify(updatedTeamMembers));
      setName('');
    } else {
      setError("Número máximo de jogadores atingido (5 jogadores) ou nome em branco.");
    }
  };

  const handleRandomizeChampions = () => {
    const shuffledChampions = shuffleArray(champions);
    const randomizedTeams = {};

    teamMembers.forEach((member, index) => {
      const champion = shuffledChampions[index % shuffledChampions.length];
      randomizedTeams[member] = champion;
    });

    setSelectedChampions(randomizedTeams);
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleRemovePlayer = (player) => {
    const updatedTeamMembers = teamMembers.filter((member) => member !== player);
    setTeamMembers(updatedTeamMembers);
    localStorage.setItem('teamMembers', JSON.stringify(updatedTeamMembers));

    const updatedSelectedChampions = { ...selectedChampions };
    delete updatedSelectedChampions[player];
    setSelectedChampions(updatedSelectedChampions);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        p: 3,
        backgroundColor: "#f0f0f0"
      }}
    >
      <Typography variant="h4" component="h4" gutterBottom>
        Clica pra sortear ae garai
      </Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 2,
          mb: 3,
          width: "100%",
          maxWidth: "400px"
        }}
        onSubmit={handleAddMember}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Nome do jogador"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ flexGrow: 1 }}
            disabled={teamMembers.length >= 5 || !name}
          >
            {loading ? <CircularProgress size={24} /> : "Adicionar"}
          </Button>
          <Button
            variant="contained"
            onClick={handleRandomizeChampions}
            sx={{ flexGrow: 1 }}
            disabled={teamMembers.length === 0}
          >
            {loading ? <CircularProgress size={24} /> : "Sortear"}
          </Button>
        </Box>
      </Box>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ mt: 2, mb: 3 }}>
        {teamMembers.length > 0 && (
          <>
            <Typography variant="h6">Jogadores adicionados:</Typography>
            <Box sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
              mt: 1
            }}>
              {teamMembers.map((member, index) => (
                <Chip
                  key={index}
                  label={member}
                  onDelete={() => handleRemovePlayer(member)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        {Object.keys(selectedChampions).length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>Campeões Sorteados:</Typography>
            <Box sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
              mt: 1
            }}>
              {Object.entries(selectedChampions).map(([player, champion], index) => (
                <Card key={index} sx={{ width: "200px", textAlign: "left" }}>
                  <CardHeader title={player} titleTypographyProps={{ variant: "body1" }} />
                  <CardContent>
                    <Typography variant="h6">{champion}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default App;
