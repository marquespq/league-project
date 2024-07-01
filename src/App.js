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
    if (teamMembers.length < 5 && name && !teamMembers.includes(name)) {
      const updatedTeamMembers = [...teamMembers, name];
      setTeamMembers(updatedTeamMembers);
      localStorage.setItem('teamMembers', JSON.stringify(updatedTeamMembers));
      setName('');
    } else {
      if (teamMembers.includes(name)) {
        setError("Nome de jogador duplicado. Por favor, escolha um nome diferente.");
      } else {
        setError("Número máximo de jogadores atingido (5 jogadores) ou nome em branco.");
      }
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
        background: "linear-gradient(135deg, #1b2735 0%, #090a0f 100%)",
        color: "#cdd2d4",
      }}
    >
      <Typography variant="h4" component="h4" gutterBottom sx={{ fontWeight: "bold", color: "#f0f0f0" }}>
        Sorteador de Campeões
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
          maxWidth: "400px",
          background: "#2c3e50",
          p: 3,
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
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
          sx={{
            backgroundColor: "#3b4a5a",
            borderRadius: "4px",
            '& .MuiInputBase-root': {
              color: "#fff"
            },
            '& .MuiFormLabel-root': {
              color: "#b0bec5"
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: "#62727b"
            }
          }}
        />
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              flexGrow: 1,
              backgroundColor: "#3498db",
              color: "#fff",
              '&:hover': { backgroundColor: "#2980b9" },
            }}
            disabled={teamMembers.length >= 5 || !name}
          >
            {loading ? <CircularProgress size={24} /> : "Adicionar"}
          </Button>
          <Button
            variant="contained"
            onClick={handleRandomizeChampions}
            sx={{
              flexGrow: 1,
              backgroundColor: "#e67e22",
              color: "#fff",
              '&:hover': { backgroundColor: "#d35400" },
            }}
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
            <Typography variant="h6" sx={{ color: "#ecf0f1" }}>Jogadores adicionados:</Typography>
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
                  sx={{ m: 0.5, backgroundColor: "#34495e", color: "#ecf0f1" }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        {Object.keys(selectedChampions).length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ color: "#ecf0f1" }}>Campeões Sorteados:</Typography>
            <Box sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
              mt: 1
            }}>
              {Object.entries(selectedChampions).map(([player, champion], index) => (
                <Card
                  key={index}
                  sx={{
                    width: "180px",
                    textAlign: "center",
                    backgroundColor: "#34495e",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.2s",
                    '&:hover': {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardHeader
                    title={player}
                    titleTypographyProps={{ variant: "body1", color: "#ecf0f1" }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#ecf0f1" }}>{champion}</Typography>
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
