let stylesheet
function publishRules(rules) {
   if(!stylesheet) {
      if (document.styleSheets.length == 0) {
         let head = document.getElementsByTagName('head')[0]
         head.insertAdjacentHTML('afterbegin', '<style id="simple-css"></style>')
      }
      stylesheet = document.styleSheets[0]
   }
   rules.filter(rule => !(rule.startsWith('/*')))
   .forEach(rule => {
      try {stylesheet.insertRule(rule)} 
      catch (error) {console.log(error.message)}
   })
}