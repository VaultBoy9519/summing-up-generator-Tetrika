import React from "react";

const Header = () => {
  return (
    <header className="d-flex align-center p-10">
      <div className="headerLogo justify-content-start d-flex align-center d-none d-md-block">
        <a href="https://drive.google.com/u/0/uc?id=19h10qfy3r58RCdy0Bj23XPjV4cgUPMB6&export=download"
           target="_blank">
          <img width={90} src="img/logo.png" style={{ cursor: "pointer" }} alt="Logo" />
        </a>
      </div>
      <div className="d-flex justify-content-center flex-grow-1 headerText">
        <p className="titleGen">Генератор резюмирования by VaultBoy</p>
      </div>
    </header>

  );
};

export default Header;