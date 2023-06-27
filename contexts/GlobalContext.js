import React, { useState, useEffect, useContext } from "react";
export const GlobalContext = React.createContext({
  score: null,
  setScore: null
});
