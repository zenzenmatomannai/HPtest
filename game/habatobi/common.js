function SymError(){
    return true;
  }
  
  window.onerror = SymError;
  
  var SymRealWinOpen = window.open;
  
  function SymWinOpen(url, name, attributes){
    return (new Object());
  }
  
  window.open = SymWinOpen;
  