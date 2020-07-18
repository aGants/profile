let themeBtn = document.querySelector('.header__button');

themeBtn.addEventListener("click", function() {
  if(document.documentElement.hasAttribute("theme")){
    document.documentElement.removeAttribute("theme");
    themeBtn.classList.add('switch-on');

  } else {
    document.documentElement.setAttribute("theme", "dark");
    themeBtn.classList.remove('switch-on');
  }
});