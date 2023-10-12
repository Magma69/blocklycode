window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['app']) {
      replaceText(`${type}-version`, `Version: 1.0.0`)
    }
  })