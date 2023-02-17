const slides = document.querySelectorAll("input[name='slider']");
const infos = document.querySelectorAll("label[class='info']");

slides.forEach((sl) => {
  sl.addEventListener('change', (event) => {
    infos.forEach(i => {i.style.display = "none";});
    let curr_id = event.target.id.slice(-1);
    document.getElementById("info-"+curr_id).style.display = "block";
  });}
);

  