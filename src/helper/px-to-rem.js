const browserContext = 16; // Default
const widthBrowser = 1440;
function rem(pixels = 0, widthSet = widthBrowser, context = browserContext) {
  return `${(pixels / context) * (widthBrowser / widthSet)}rem`;
}

export { rem };
