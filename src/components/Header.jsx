import React from "react";

const Header = ({ massMode }) => {
  return (
    <header className="d-flex align-center p-10">

      <div className="d-flex justify-content-center flex-grow-1">
        <p className="titleGen">{massMode ? "Компенсация массовых" : "Анализатор уроков"}</p>
      </div>
    </header>

  );
};

export default Header;