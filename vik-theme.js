(function(){
  const labels={normal:"Normal",dark:"Oscura",warm:"Cálida"};
  const order=["normal","dark","warm"];
  const storageKey="vik-theme";
  function current(){return localStorage.getItem(storageKey)||"normal";}
  function apply(theme){
    const next=labels[theme]?theme:"normal";
    document.documentElement.dataset.theme=next;
    localStorage.setItem(storageKey,next);
    document.querySelectorAll("[data-theme-toggle]").forEach(button=>{
      button.setAttribute("aria-label",`Cambiar estética. Actual: ${labels[next]}`);
      button.innerHTML=`<span class="theme-dot" aria-hidden="true"></span><span>Tema</span><small>${labels[next]}</small>`;
    });
  }
  function cycle(){
    const theme=current();
    apply(order[(order.indexOf(theme)+1)%order.length]);
  }
  apply(current());
  document.addEventListener("click",event=>{
    const button=event.target.closest("[data-theme-toggle]");
    if(button)cycle();
  });
  window.addEventListener("storage",event=>{
    if(event.key===storageKey)apply(event.newValue||"normal");
  });
  document.addEventListener("DOMContentLoaded",()=>apply(current()));
})();
