import { useState, useEffect } from "react";
import { Box, Heading, VStack, HStack, Text, Input, Button, FormControl } from "@chakra-ui/react";

const API_KEY = "96505c1320ddb01282819c64b0d3b749";
const CITIES = ["Lisbon", "Stockholm", "Luleå", "Shanghai", "Honolulu"];

const Index = () => {
  const [temperatures, setTemperatures] = useState({});
  const [newCity, setNewCity] = useState("");

  const handleInputChange = (event) => {
    setNewCity(event.target.value);
  };

  const handleSubmit = () => {
    if (newCity.trim() !== "") {
      CITIES.push(newCity.trim());
      setNewCity("");
    }
  };

  useEffect(() => {
    const fetchTemperatures = async () => {
      const newTemperatures = {};
      for (const city of CITIES) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        newTemperatures[city] = data.main.temp;
      }
      setTemperatures(newTemperatures);
    };

    fetchTemperatures();
    const intervalId = setInterval(fetchTemperatures, 60000); // Update every minute

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const maxTemperature = Math.max(...Object.values(temperatures), 30);

  return (
    <Box textAlign="center" py={10}>
      <Heading as="h1" size="xl" mb={4}>
        Real-time Weather Chart
      </Heading>
      <FormControl display="flex" alignItems="center" mb={8}>
        <Input type="text" placeholder="Enter a city" value={newCity} onChange={handleInputChange} mr={4} />
        <Button onClick={handleSubmit} colorScheme="blue">
          Submit
        </Button>
      </FormControl>
      <VStack spacing={4}>
        {CITIES.map((city) => (
          <HStack key={city} w="100%" spacing={4}>
            <Text fontWeight="bold" w="100px" textAlign="right">
              {city}
            </Text>
            <Box w={`${(temperatures[city] / maxTemperature) * 80}%`} h="30px" bg="blue.500" />
            <Text w="50px">{temperatures[city]}°C</Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default Index;
