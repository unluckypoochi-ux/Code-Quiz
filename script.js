const DATA={
HTML:[
["Which tag creates a hyperlink?",["<a>","<link>","<href>","<url>"],0,"The <a> (anchor) tag with an href attribute makes links."],
["Which tag holds the page's visible content?",["<head>","<body>","<meta>","<title>"],1,"<body> contains everything shown in the browser window."],
["Which attribute gives an image alternative text?",["title","src","alt","name"],2,"alt is read by screen readers and shown if the image fails."],
["Which tag is semantic for site navigation?",["<div>","<nav>","<span>","<section>"],1,"<nav> marks a block of navigation links."],
["Which input type hides typed characters?",["secret","hidden","text","password"],3,"type=\"password\" masks the characters."]],
CSS:[
["Which property changes text color?",["color","font-color","text-style","fill"],0,"color sets the text color."],
["How do you select an element with id 'main'?",[".main","main","#main","*main"],2,"# selects by id, . selects by class."],
["Which display value makes a flexible row layout?",["block","flex","inline","table"],1,"display:flex enables Flexbox."],
["Which property adds space INSIDE an element's border?",["margin","gap","spacing","padding"],3,"padding is inside the border; margin is outside."],
["Which unit is relative to the viewport width?",["px","em","vw","pt"],2,"1vw equals 1% of the viewport width."]],
JavaScript:[
["Which keyword declares a variable that cannot be reassigned?",["var","let","const","static"],2,"const prevents reassignment of the binding."],
["What does document.getElementById() return?",["An array","An element","A string","A promise"],1,"It returns the matching element or null."],
["Which method adds an item to the end of an array?",["push()","pop()","shift()","add()"],0,"push() appends; pop() removes from the end."],
["What does '===' check?",["Value only","Type only","Value and type","Reference only"],2,"Strict equality compares both value and type."],
["Which event fires when a button is clicked?",["onhover","onclick","onpress","onsubmit"],1,"click is the standard event for mouse or tap clicks."]]
};
const $=id=>document.getElementById(id);
let topic,list,i,score,log;

function best(t,v){try{if(v!==undefined)localStorage.setItem("cq_"+t,v);return localStorage.getItem("cq_"+t)}catch(e){return null}}
function show(id){["home","quiz","result"].forEach(s=>$(s).classList.toggle("hide",s!==id))}

function home(){
  $("topics").innerHTML="";
  Object.keys(DATA).forEach(t=>{
    const b=document.createElement("button");b.className="topic";
    const bs=best(t);
    b.innerHTML=`${t}<small>${bs!==null?"Best: "+bs+"/"+DATA[t].length:DATA[t].length+" questions"}</small>`;
    b.onclick=()=>start(t);$("topics").appendChild(b);
  });
  show("home");
}
function start(t){topic=t;list=[...DATA[t]].sort(()=>Math.random()-.5);i=0;score=0;log=[];render();show("quiz")}
function render(){
  const [q,o,a]=list[i];
  $("q").textContent=q;$("note").textContent="";$("next").disabled=true;
  $("next").textContent=i===list.length-1?"See result":"Next question";
  $("count").textContent=`Question ${i+1} of ${list.length}`;
  $("liveScore").textContent=`Score: ${score}`;
  $("prog").style.width=(i/list.length*100)+"%";
  $("opts").innerHTML="";
  o.forEach((txt,k)=>{
    const b=document.createElement("button");b.className="opt";b.textContent=txt;
    b.onclick=()=>pick(k);$("opts").appendChild(b);
  });
}
function pick(k){
  const [q,o,a,why]=list[i];
  const btns=[...$("opts").children];
  btns.forEach((b,n)=>{b.disabled=true;if(n===a)b.classList.add("ok");else if(n===k)b.classList.add("bad")});
  if(k===a)score++;
  log.push({q,right:k===a});
  $("note").textContent=(k===a?"Correct. ":"Not quite. ")+why;
  $("liveScore").textContent=`Score: ${score}`;
  $("next").disabled=false;$("next").focus();
}
$("next").onclick=()=>{i++;i<list.length?render():finish()};
function finish(){
  const n=list.length,prev=best(topic);
  if(prev===null||score>+prev)best(topic,score);
  $("rTopic").textContent=topic+" quiz finished";
  $("rScore").textContent=`${score}/${n}`;
  $("rMsg").textContent=score===n?"Perfect score!":score>=n*.6?"Good work. Review the missed ones below.":"Keep practising. Review the answers below and try again.";
  $("review").innerHTML=log.map(l=>`<li><b class="${l.right?"ok":"bad"}">${l.right?"Correct":"Missed"}</b> – ${l.q}</li>`).join("");
  show("result");
}
$("again").onclick=home;
$("theme").onclick=()=>{
  const r=document.documentElement,dark=getComputedStyle(r).getPropertyValue("--bg").trim()==="#15142b";
  r.dataset.theme=dark?"light":"dark";
};
home();
