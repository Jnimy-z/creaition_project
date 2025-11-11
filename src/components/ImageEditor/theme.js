export const customTheme = {
    // 背景色
    'toolbar.background': 'var(--bg-color)',
    'canvas.background': 'var(--white)',
    'panel.background': 'var(--white)',
    'menu.background': 'var(--white)',
    'dropdown.background': 'var(--white)',
  
    // 按钮样式
    'button.background': 'var(--white)',
    'button.border': 'none',
    'button.borderRadius': 'var(--btn-radius)',
    'button.minHeight': 'var(--btn-min-height)',
    'button.color': 'var(--text-color)',
    'button.hover.background': 'var(--primary-grey)',
    'button.hover.color': 'var(--text-color)',
    'button.hover.fontVariationSettings': '"wght" 120, "slnt" 12',
    'button.active.background': 'var(--primary-grey)',
    'button.active.color': 'var(--text-color)',
  
    // 输入框样式
    'input.background': 'var(--white)',
    'input.border': '1px solid var(--secondary-grey)',
    'input.borderRadius': 'var(--input-radius)',
    'input.height': 'var(--input-height)',
    'input.color': 'var(--text-color)',
    'input.hover.border': '1px solid var(--black)',
    'input.focus.border': '1px solid var(--black)',
  
    // 字体样式
    'fontFamily': 'var(--main-font)',
    'fontSize': 'var(--font-size-md)',
    'fontVariationSettings': '"wght" 60',
    'text.color': 'var(--text-color)',
  
    // 其他组件
    'card.borderRadius': 'var(--card-radius)',
    'icon.color': 'var(--black)',
    'separator.color': 'var(--primary-grey)',
    'progress.barColor': 'var(--black)',
    'progress.bgColor': 'var(--primary-grey)'
  }
  
  // 映射 Less 变量到 CSS 变量（供主题使用）
  export const initCssVariables = () => {
    const style = document.documentElement.style
    style.setProperty('--bg-color', '#f0f0f0')
    style.setProperty('--white', '#ffffff')
    style.setProperty('--black', '#000000')
    style.setProperty('--text-color', '#000000')
    style.setProperty('--primary-grey', '#efefee')
    style.setProperty('--secondary-grey', '#bebebe')
    style.setProperty('--btn-radius', '50px')
    style.setProperty('--input-radius', '0px')
    style.setProperty('--card-radius', '1rem')
    style.setProperty('--btn-min-height', '35px')
    style.setProperty('--input-height', '50px')
    style.setProperty('--main-font', "'strokeWeight(var)', 'Eina03-Regular', sans-serif")
  }