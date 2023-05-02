import React from "react";

const Header = () => {
  return (
    <header className="d-flex align-center p-10 ml-30 mr-10">
      <div className="headerLogo justify-content-start d-flex align-center d-none d-md-block">
        <img width={90} src="img/logo.png" alt="Logo" />
      </div>
      <div className="d-flex justify-content-center flex-grow-1">
        <p className="titleGen">Генератор резюмирования by VaultBoy</p>
      </div>
    </header>

  );
};

export default Header;