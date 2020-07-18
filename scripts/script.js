let themeBtn = document.querySelector('.header__button');

themeBtn.addEventListener("click", function() {
  if(document.documentElement.hasAttribute("theme")){
    document.documentElement.removeAttribute("theme");
  } else {
    document.documentElement.setAttribute("theme", "dark");
  }
});