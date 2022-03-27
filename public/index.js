window.addEventListener("load", ()=>{
  document.getElementsByClassName("searchButton")[0].addEventListener("click", ()=>{
    window.location=window.origin+"/search?q="+encodeURI(document.getElementsByClassName("searchTerm")[0].value);
  })
})