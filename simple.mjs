const cssParser = (function() {
const ReplaceBetween = (function() {
class BaseNode {   constructor() {this.children = []}   get outer() { return this.before + this.inner + this.after }   get inner() {return this.children.map(child => child.outer).join('')}   set outer(value) {this.inner = value; this.before = ''; this.after = ''}   set inner(value) {this.children = []; this.children.push(new TextNode(value,this))}   walkNodes(modifiers=[],parent = this) {      parent.children.forEach(child => {         if(child instanceof BaseNode === false) return         this.walkNodes(modifiers,child)         this.runModifiers(modifiers,child,true)      });   }   walkTextNodes(modifiers=[],parent = this) {      parent.children.forEach(child => {         if(child instanceof BaseNode) this.walkTextNodes(modifiers,child)         else this.runModifiers(modifiers,child,false)      });   }   walk(modifiers=[],parent = this) {      parent.children.forEach(child => {         const isNode = child instanceof BaseNode         if(isNode) this.walk(modifiers,child)         this.runModifiers(modifiers,child,isNode)      });   }   runModifiers(modifiers,child,isNode) {      for(const modifier of modifiers) {         const result = modifier(child,isNode)         if(result === false) return false      }   }}
function buildTree(starts, ends) {   if(starts[0].n > ends[0].n) ends.shift()   if(starts[starts.length-1].n > ends[ends.length-1].n) starts.pop()   if (starts.length !== ends.length) throw new Error(`Parsing error: unmatched tags detected. (${starts.length},${ends.length})`);   let pairs = starts.map((start, i) => ({ start, end: ends[i], children: [] }));   pairs.forEach((curPair, i) => {      for (let k = i; k < pairs.length; k++) {         if (curPair.end.n > pairs[k].start.n) {            const end = pairs[k].end            const curEnd = curPair.end            curPair.end = end            pairs[k].end = curEnd         }      }   })   pairs.sort((a, b) => a.end.n - b.end.n);   pairs.forEach((curPair, i) => {      for (let k = i; k < pairs.length; k++) {         if (curPair.start.n > pairs[k].start.n && curPair.end.n < pairs[k].end.n) {            if (!curPair.level) curPair.level = 0            curPair.level++            pairs[k].children.push(curPair)         }      }   });   function filterPairs(pairs, curLevel = 0) {      pairs = pairs.filter(({ level }) => (!level || level <= curLevel))      pairs.forEach(pair => {         if (pair.children.length === 0) return         pair.children = filterPairs(pair.children, curLevel + 1)      });      return pairs   }   pairs = filterPairs(pairs)   return pairs}
function find(string, r, offset = 0) {   const arr = []   let curString = string   while (true) {      const match = curString.match(r)      if (!match) break      const length = match[0].length      arr.push({n:offset+match.index,length})      offset = offset+match.index+length      curString = string.slice(offset)   }   return arr}
class ReplaceBetween extends BaseNode {   constructor(content, startR, endR) {      super()      if (typeof content !== 'string') throw `Expected 'content' to be a string, but got '${typeof content}'`      if (startR instanceof RegExp == false) throw '"startR" should be an instance of RegExp.'      if (endR instanceof RegExp == false) throw '"endR" should be an instance of RegExp.'      this.content = content      this.startR = startR      this.endR = endR      this.build()   }   build() {      const { content, startR, endR } = this      const starts = find(content, startR)      const ends = find(content, endR)      if(starts.length === 0 || ends.length === 0) return      const children = buildTree(starts, ends)      if(children.length === 0) return      const start = children[0].start.n      const {n:end,length:endLength} = children[children.length - 1].end      this.before = start > 0 ? content.slice(0, start) : ''      this.after = end + endLength < content.length ? content.slice(end+endLength, content.length) : ''      children.forEach((child,i) => {         this.children.push(new Node(this, child, this))          if(i === children.length-1) return         const nextStart = children[i+1].start.n         const curendEnd = child.end.n+child.end.length         if(nextStart > curendEnd) {            this.children.push(new TextNode(content.slice(curendEnd,nextStart),this))         }      });   }}
class Node extends BaseNode {   constructor(root, obj, parent = null) {      super()      this.parent = parent      if(parent) this.index = parent.children.length      this.root = root      this.addChildren(obj)   }   addChildren(obj) {      const { start, end, children } = obj      const root = this.root      let curStart = start.n + start.length, curEnd = end.n      this.open = root.content.slice(start.n, curStart)      children.forEach((child,i) => {         if(child.start.n > curStart) this.children.push(new TextNode(root.content.slice(curStart, child.start.n),this))         this.children.push(new Node(root, child, this))         curStart = child.end.n+child.end.length      });      if(curEnd > curStart) this.children.push(new TextNode(root.content.slice(curStart,curEnd),this))      this.close = root.content.slice(curEnd, end.n+end.length)      return this   }   get outer() {return this.open + this.inner + this.close}   set outer(value) {this.inner = value; this.open = ''; this.close = ''}   get prev() {return this.parent ? this.parent.children[this.index - 1] : null}   get next() {return this.parent ? this.parent.children[this.index + 1] : null}}
class TextNode {   constructor(content,parent) {      this.outer = content      this.parent = parent      if(parent) this.index = parent.children.length      this.open = ''      this.close = ''   }   get prev() {return this.parent.children[this.index - 1] || null}   get next() {return this.parent.children[this.index + 1] || null}}
return ReplaceBetween
})()
function buildStyles(children, comments,cssTree = []) {   children.forEach(node => {      const styles = {}, obj = {};      if (node.constructor.name === 'TextNode') {         const trimed = node.outer.trim()         if (trimed.length === 0) return         if (trimed.startsWith('/*') && trimed.endsWith('*/')) {            if(comments) cssTree.push(trimed)         } else trimed.split(';').filter(Boolean).forEach(str => {            str = str.replace(/\/\*[\s\S]*?\*\//g,comment =>  '')            const parts = str.trim().split(':')            const propname = parts.shift().trim().split(/\s/).pop()            styles[propname] = parts.join(':').trim()         })      } else {         let selector = node.open.replace(/\{$/, '').trim().replace(/^\&/, '')         selector = selector.replace(/\/\*[\s\S]*?\*\//g,(comment) => '')         if (node.open.startsWith('@')) styles[selector] = buildStyles(node.children,comments)         else {            buildStyles(node.children,comments).forEach(item => {               Object.entries(item).forEach(([prop, val]) => obj[prop] = val)            });            styles[selector] = obj         }      }      if (Object.keys(styles).length) cssTree.push(styles)   })   return cssTree}
function cssParser(rawCss,comments = true) {   const transformer = new ReplaceBetween(rawCss, /[*\w\&@:.\[#].*?\{/m, /\}/)   let { before, after, children } = transformer   const cssTree = buildStyles(children,comments)   before = before.trim(); after = after.trim();   if(before) cssTree.unshift(before)   if(after) cssTree.push(after)   return cssTree}
return cssParser
})()
class ColorTools {

    static hexToRGB(H) {
        let r = 0, g = 0, b = 0;
        if (H.length == 4) {
            r = parseInt("0x" + H[1] + H[1], 16);
            g = parseInt("0x" + H[2] + H[2], 16);
            b = parseInt("0x" + H[3] + H[3], 16);
        } else if (H.length == 7) {
            r = parseInt("0x" + H[1] + H[2], 16)
            g = parseInt("0x" + H[3] + H[4], 16)
            b = parseInt("0x" + H[5] + H[6], 16)
        }

        return { r, g, b }
    }

    static rgbToHex(r, g, b) {
        let RR = ((r.toString(16).length == 1) ? "0" + r.toString(16) : r.toString(16));
        let GG = ((g.toString(16).length == 1) ? "0" + g.toString(16) : g.toString(16));
        let BB = ((b.toString(16).length == 1) ? "0" + b.toString(16) : b.toString(16));
        return "#" + RR + GG + BB
    }

    static hexToHSL(H) {
        let { r, g, b } = ColorTools.hexToRGB(H)
        r /= 255; g /= 255; b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0, s = 0, l = 0;

        if (delta == 0) h = 0;
        else if (cmax == r) h = ((g - b) / delta) % 6;
        else if (cmax == g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);
        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return { h, s, l }
    }

    static hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);

        if (r.length == 1) r = "0" + r;
        if (g.length == 1) g = "0" + g;
        if (b.length == 1) b = "0" + b;

        return "#" + r + g + b;
    }

    static shade(hex, percent, opacity) {
        hex = ColorTools.colorToHex(hex)
        const { r, g, b } = ColorTools.hexToRGB(hex);

        let modifiedR = parseInt(r * (100 + percent) / 100);
        let modifiedG = parseInt(g * (100 + percent) / 100);
        let modifiedB = parseInt(b * (100 + percent) / 100);

        modifiedR = (modifiedR < 255) ? modifiedR : 255;
        modifiedG = (modifiedG < 255) ? modifiedG : 255;
        modifiedB = (modifiedB < 255) ? modifiedB : 255;

        if (opacity !== undefined) return `rgba(${modifiedR},${modifiedG},${modifiedB},${opacity})`;
        return ColorTools.rgbToHex(modifiedR, modifiedG, modifiedB);
    }

    static luma(hex) {
        const { r, g, b } = ColorTools.hexToRGB(hex)
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    static isDark(c, darkThreshold = 100) {
        return ColorTools.luma(c) < darkThreshold
    }

    static cssColors = {
        "aliceblue": "#f0f8ff",
        "antiquewhite": "#faebd7",
        "aqua": "#00ffff",
        "aquamarine": "#7fffd4",
        "azure": "#f0ffff",
        "beige": "#f5f5dc",
        "bisque": "#ffe4c4",
        "black": "#000000",
        "blanchedalmond": "#ffebcd",
        "blue": "#0000ff",
        "blueviolet": "#8a2be2",
        "brown": "#a52a2a",
        "burlywood": "#deb887",
        "cadetblue": "#5f9ea0",
        "chartreuse": "#7fff00",
        "chocolate": "#d2691e",
        "coral": "#ff7f50",
        "cornflowerblue": "#6495ed",
        "cornsilk": "#fff8dc",
        "crimson": "#dc143c",
        "cyan": "#00ffff",
        "darkblue": "#00008b",
        "darkcyan": "#008b8b",
        "darkgoldenrod": "#b8860b",
        "darkgray": "#a9a9a9",
        "darkgreen": "#006400",
        "darkgrey": "#a9a9a9",
        "darkkhaki": "#bdb76b",
        "darkmagenta": "#8b008b",
        "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00",
        "darkorchid": "#9932cc",
        "darkred": "#8b0000",
        "darksalmon": "#e9967a",
        "darkseagreen": "#8fbc8f",
        "darkslateblue": "#483d8b",
        "darkslategray": "#2f4f4f",
        "darkslategrey": "#2f4f4f",
        "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3",
        "deeppink": "#ff1493",
        "deepskyblue": "#00bfff",
        "dimgray": "#696969",
        "dimgrey": "#696969",
        "dodgerblue": "#1e90ff",
        "firebrick": "#b22222",
        "floralwhite": "#fffaf0",
        "forestgreen": "#228b22",
        "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc",
        "ghostwhite": "#f8f8ff",
        "gold": "#ffd700",
        "goldenrod": "#daa520",
        "gray": "#808080",
        "green": "#008000",
        "greenyellow": "#adff2f",
        "grey": "#808080",
        "honeydew": "#f0fff0",
        "hotpink": "#ff69b4",
        "indianred": "#cd5c5c",
        "indigo": "#4b0082",
        "ivory": "#fffff0",
        "khaki": "#f0e68c",
        "lavender": "#e6e6fa",
        "lavenderblush": "#fff0f5",
        "lawngreen": "#7cfc00",
        "lemonchiffon": "#fffacd",
        "lightblue": "#add8e6",
        "lightcoral": "#f08080",
        "lightcyan": "#e0ffff",
        "lightgoldenrodyellow": "#fafad2",
        "lightgray": "#d3d3d3",
        "lightgreen": "#90ee90",
        "lightgrey": "#d3d3d3",
        "lightpink": "#ffb6c1",
        "lightsalmon": "#ffa07a",
        "lightseagreen": "#20b2aa",
        "lightskyblue": "#87cefa",
        "lightslategray": "#778899",
        "lightslategrey": "#778899",
        "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0",
        "lime": "#00ff00",
        "limegreen": "#32cd32",
        "mediumturquoise": "#48d1cc",
        "mediumvioletred": "#c71585",
        "midnightblue": "#191970",
        "mintcream": "#f5fffa",
        "mistyrose": "#ffe4e1",
        "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead",
        "navy": "#000080",
        "oldlace": "#fdf5e6",
        "olive": "#808000",
        "olivedrab": "#6b8e23",
        "orange": "#ffa500",
        "orangered": "#ff4500",
        "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa",
        "palegreen": "#98fb98",
        "paleturquoise": "#afeeee",
        "palevioletred": "#db7093",
        "papayawhip": "#ffefd5",
        "peachpuff": "#ffdab9",
        "peru": "#cd853f",
        "pink": "#ffc0cb",
        "plum": "#dda0dd",
        "powderblue": "#b0e0e6",
        "purple": "#800080",
        "rebeccapurple": "#663399",
        "red": "#ff0000",
        "rosybrown": "#bc8f8f",
        "royalblue": "#4169e1",
        "saddlebrown": "#8b4513",
        "salmon": "#fa8072",
        "sandybrown": "#f4a460",
        "seagreen": "#2e8b57",
        "seashell": "#fff5ee",
        "sienna": "#a0522d",
        "silver": "#c0c0c0",
        "skyblue": "#87ceeb",
        "slateblue": "#6a5acd",
        "slategray": "#708090",
        "slategrey": "#708090",
        "snow": "#fffafa",
        "springgreen": "#00ff7f",
        "steelblue": "#4682b4",
        "tan": "#d2b48c",
        "teal": "#008080",
        "thistle": "#d8bfd8",
        "tomato": "#ff6347",
        "turquoise": "#40e0d0",
        "violet": "#ee82ee",
        "wheat": "#f5deb3",
        "white": "#ffffff",
        "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00",
        "yellowgreen": "#9acd32"
    }

    static colorToHex(input, defaultHex = "#000000") {
        const { cssColors } = ColorTools
        if (typeof input !== 'string') return defaultHex;
        const normalizedInput = input.trim().toLowerCase();
        if (cssColors[normalizedInput]) return cssColors[normalizedInput];
        if (/^#[0-9a-f]{6}$/i.test(normalizedInput)) return normalizedInput;
        if (/^#[0-9a-f]{3}$/i.test(normalizedInput)) {
            const expandedHex = normalizedInput.split('')
            .map(char => char === '#' ? char : char + char).join('');
            return expandedHex;
        }

        return defaultHex;
    }
}


const defaultShorts = {
   a: 'animation',
   bgc: 'background-color',
   c: 'color',
   bg: 'background',
   bgi: 'background-image',
   b: 'border',
   br: 'border-right',
   bl: 'border-left',
   bt: 'border-top',
   bb: 'border-bottom',
   bc: 'border-color',
   brc: 'border-right-color',
   blc: 'border-left-color',
   btc: 'border-top-color',
   bbc: 'border-bottom-color',
   bs: 'border-style',
   brs: 'border-right-style',
   bls: 'border-left-style',
   bts: 'border-top-style',
   bbs: 'border-bottom-style',
   bw: 'border-width',
   brw: 'border-right-width',
   blw: 'border-left-width',
   btw: 'border-top-width',
   bbw: 'border-bottom-width',
   radius: 'border-radius',
   o: 'outline',
   oc: 'outline-color',
   os: 'outline-style',
   ow: 'outline-width',
   maxw: 'max-width',
   minw: 'min-width',
   h: 'height',
   w: 'width',
   maxh: 'max-height',
   minh: 'min-height',
   of: 'overflow',
   ofx: 'overflow-x',
   ofy: 'overflow-y',
   scrollb: 'scroll-behavior',
   p: 'padding',
   m: 'margin',
   pr: 'padding-right',
   pl: 'padding-left',
   pt: 'padding-top',
   pb: 'padding-bottom',
   mr: 'margin-right',
   ml: 'margin-left',
   mt: 'margin-top',
   mb: 'margin-bottom',
   d: 'display',
   flexw: 'flex-wrap',
   flexg: 'flex-grow',
   flexdir: 'flex-direction',
   ai: 'align-items',
   ac: 'aline-content',
   jc: 'justify-content',
   gcols: 'grid-template-columns',
   grows: 'grid-template-rows',
   gacols: 'grid-auto-columns',
   garows: 'grid-auto-rows',
   areas: 'grid-template-areas',
   area: 'grid-area',
   dir: 'direction',
   textt: 'text-transform',
   ta: 'text-align',
   td: 'text-decoration',
   ws: 'white-space',
   ww: 'word-wrap',
   ff: 'font-family',
   to: 'text-overflow',
   ls: 'letter-spacing',
   lh: 'line-height',
   wb: 'word-break',
   fv: 'font-variant',
   fs: 'font-size',
   fw: 'font-weight',
   fstyle: 'font-style',
   f: 'font',
   pos: 'position',
   z: 'z-index',
   tr: 'transform',
   cur: 'cursor'
}

function flatStyles(styles,newStyles = {}) {
   for(let selector in styles) {
      const rules = styles[selector]
      if(Array.isArray(rules)) { // it's @media/@keyframes/...
         newStyles[selector] = rules
         continue
      }
      for(let prop in rules) {
         let value = rules[prop]
         if(typeof value === 'object') { // nested styles
            const nestedSelecor = prop.split(',').map(p => selector.trim().split(',').map(s => s+p).join()).join()
            flatStyles({[nestedSelecor]:value},newStyles)
         } else { // prop:value
            if(!newStyles[selector]) newStyles[selector] = {}
            newStyles[selector][prop] = value
         }
      }
   }
   return newStyles
}

function buildRules(rules, shorts, newRules = {}) {
   for (let propName in rules) {
      let propValue = buildPropValue(rules[propName])
      propName = shorts[propName] ? shorts[propName] : camelCase(propName)
      propName = propName.replace(/^\$/, '--')
      newRules[propName] = propValue
   }
   return newRules
}
function camelCase(v) {
   return v.split('').map((l,i) => {
      const last = v[i-1]
      if(i === 0 || last === ' ' || last == '-' || !(/[A-Z]/.test(l))) return l
      return '-'+l.toLowerCase()
   }).join('')
}
function buildCalc(propValue) {
   const operations = ['*', '-', '+', '/']
   return propValue.replace(/\[(.*?)\]/g, (match, calc) => {
      return 'calc(' + calc.split('').map((l, i) => {
         if (!operations.includes(l)) return l
         if(l === '-' && /[^\d\s]/.test(calc[i+1])) return l
         if (calc[i - 1] !== ' ') l = ' ' + l
         if (calc[i + 1] !== ' ') l = l + ' '
         return l
      }).join('') + ')'
   })
}
function getVars(values) {
   return values.replace(/\$([\w-$]*)(\(\$?([\w-()$]*)\))?/g, (match, name, value) => {
      value = value ? ',' + getVars(value.replace(/[()]/g, '')) : ''
      return `var(--${camelCase(name)}${value})`
   })
}
function buildPropValue(propValue) {
   propValue = propValue.toString().trim()
   if (/["'].*["']/.test(propValue)) return propValue
   propValue = buildCalc(propValue)
   propValue = getVars(propValue)
   propValue = propValue.replace(/\!/, '!important')
   return propValue
}
function buildString(string, styles) {
   string = string.trim()
   if (string.startsWith('#')) string = '/*' + string.replace(/^\#/, '') + '*/' // It's a comment
   styles.push(string)
}
function buildStyles(simples, styles = [], shorts = defaultShorts) {
   simples.forEach(obj => {
      if (typeof obj === 'string') return buildString(obj, styles,shorts)
      if (typeof obj !== 'object' || obj === null) return
      obj = flatStyles(obj)
      for (let selector in obj) {
         const rules = Array.isArray(obj[selector])
            ? buildStyles(obj[selector],[],shorts) // @media/@keyframes/...
            : buildRules(obj[selector], shorts)
         const index = styles.findIndex(obj => obj[selector] !== undefined)
         if(index >= 0) styles[index][selector] = {...styles[index][selector],...rules} // group by selector
         else styles.push({ [selector]: rules }) 
      }
   });
   return styles
}

function getCssRules(styles, space = '   ', n = '\n', s = '') {
   return styles.map(obj => {
      if (typeof obj == 'string') return obj.trim()
      const [selector, props] = Object.entries(obj)[0]
      return Array.isArray(props)
         ? `${selector} {${n}${getCssRules(props, space + space, n, space).join(n)}${n}}`
         : `${s}${selector} {${n}${Object.entries(props).map(
            ([name, value]) => `${space}${name}:${value}`
         ).join(`;${n}`)}${n}${s}}`
   })
}
class Simple {
   static shorts = defaultShorts
   static raw(content, comments = true) {
      if (typeof content !== 'string') throw 'rawSimple parameter has to be string'
      if (cssParser === undefined) throw 'cssParser not found.'
      return new Simple(cssParser(content, comments))
   }
   static styles(simples) { return new Simple(simples) }
   constructor(simples = []) {
      if (!Array.isArray(simples)) throw new Error('simples parameter should be arrray')
      this.styles = buildStyles(simples, [], Simple.shorts)
   }
   stylesheet(spaces, n = '\n') {
      const rules = (spaces && typeof spaces === 'number' && spaces > 0)
         ? getCssRules(this.styles, ' '.repeat(spaces), n)
         : getCssRules(this.styles, '', '')
      return rules.join(n)
   }
}
Simple.ColorTools = ColorTools;
export default Simple