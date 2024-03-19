import React from "react";
import { Button, HStack } from "@chakra-ui/react";

const LanguageSelector = ({ language, setLanguage }) => {
  return (
    <HStack>
      <Button onClick={() => setLanguage("en")} variant={language === "en" ? "solid" : "ghost"}>
        English
      </Button>
      <Button onClick={() => setLanguage("sv")} variant={language === "sv" ? "solid" : "ghost"}>
        Swedish
      </Button>
      <Button onClick={() => setLanguage("pt")} variant={language === "pt" ? "solid" : "ghost"}>
        Portuguese
      </Button>
    </HStack>
  );
};

export default LanguageSelector;
