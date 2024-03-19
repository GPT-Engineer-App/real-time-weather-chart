import { useState, useEffect } from "react";
import { Box, Heading, VStack, HStack, Text, Input, Button, FormControl, IconButton, Flex } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import LanguageSelector from "../components/LanguageSelector";

const API_KEY = "96505c1320ddb01282819c64b0d3b749";
const CITIES = ["Lisbon", "Stockholm", "Luleå", "Shanghai", "Honolulu"];

const translations = {
  en: {
    title: "Real-time Weather Chart",
    placeholder: "Enter a city",
    submit: "Submit",
  },
  sv: {
    title: "Realtidsväderdiagram",
    placeholder: "Ange en stad",
    submit: "Skicka",
  },
  pt: {
    title: "Gráfico de Clima em Tempo Real",
    placeholder: "Insira uma cidade",
    submit: "Enviar",
  },
};

const Index = () => {
  const [language, setLanguage] = useState("en");
  const [temperatures, setTemperatures] = useState({});
  const [newCity, setNewCity] = useState("");
  const [unit, setUnit] = useState("celsius");

  const handleInputChange = (event) => {
    setNewCity(event.target.value);
  };

  const handleSubmit = async () => {
    if (newCity.trim() !== "") {
      const city = newCity.trim();
      CITIES.push(city);
      setNewCity("");
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      setTemperatures({ ...temperatures, [city]: data.main.temp });
    }
  };

  const handleRemoveCity = (cityToRemove) => {
    const updatedCities = CITIES.filter((city) => city !== cityToRemove);
    CITIES.length = 0;
    CITIES.push(...updatedCities);
    const { [cityToRemove]: _, ...updatedTemperatures } = temperatures;
    setTemperatures(updatedTemperatures);
  };

  useEffect(() => {
    const fetchTemperatures = async () => {
      const newTemperatures = {};
      for (const city of CITIES) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit === "celsius" ? "metric" : "imperial"}`);
        const data = await response.json();
        newTemperatures[city] = Math.round(data.main.temp);
      }
      setTemperatures(newTemperatures);
    };

    fetchTemperatures();
    const intervalId = setInterval(fetchTemperatures, 60000); // Update every minute

    return () => {
      clearInterval(intervalId);
    };
    const toggleUnit = () => {
      setUnit(unit === "celsius" ? "fahrenheit" : "celsius");
    };
  }, [unit]);

  const maxTemperature = Math.max(...Object.values(temperatures), 30);

  return (
    <Box textAlign="center" py={20} bgGradient="linear(to-r, brand.900, brand.800)" minHeight="100vh" color="white">
      <HStack justify="flex-end" mb={4}>
        <LanguageSelector language={language} setLanguage={setLanguage} />
      </HStack>
      <Heading as="h1" size="2xl" mb={8} fontWeight="extrabold">
        {translations[language].title}
      </Heading>
      <FormControl display="flex" alignItems="center">
        <Input type="text" placeholder={translations[language].placeholder} value={newCity} onChange={handleInputChange} mr={4} size="lg" fontWeight="bold" focusBorderColor="brand.500" />
        <Button onClick={handleSubmit} colorScheme="brand" size="lg" fontWeight="bold" _hover={{ bg: "brand.700" }} boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)">
          {translations[language].submit}
        </Button>
      </FormControl>
      <VStack spacing={4}>
        {CITIES.map((city) => (
          <HStack key={city} w="100%" spacing={4}>
            <Text fontWeight="bold" w="100px" textAlign="right">
              {city}
            </Text>
            <Box w={`${(temperatures[city] / maxTemperature) * 80}%`} h="40px" bg="brand.600" borderRadius="md" boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" />
            <Text w="50px" fontSize="xl">
              {temperatures[city]}
              {unit === "celsius" ? "°C" : "°F"}
            </Text>
            <IconButton icon={<FaTrash />} aria-label={`Remove ${city}`} onClick={() => handleRemoveCity(city)} size="sm" variant="ghost" colorScheme="white" _hover={{ bg: "whiteAlpha.200" }} />
          </HStack>
        ))}
      </VStack>
      <Flex justify="center" mt={8}>
        <Button onClick={toggleUnit} colorScheme="brand" size="lg" fontWeight="bold" _hover={{ bg: "brand.700" }} boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)">
          {unit === "celsius" ? "Switch to Fahrenheit" : "Switch to Celsius"}
        </Button>
      </Flex>
    </Box>
  );
};

export default Index;
