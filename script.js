const imageWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".close-btn");
const downloadImgBtn = lightBox.querySelector(".download-btn");

// API key, paginations, searchTerm variables...!
const apiKey = "v1kPcIYnEZ5lkIEvmAEnPlz36ALvt494jRYKEqy5hGYfeZlNBI6OVH2E";
const perPage = 15;
let currPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  // converting recieved image to blob, creating its download link, & downloading it..!
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download image!"));
};

const showLightBox = (name, img) => {
  // Showing lightbox and setting img source, name
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerHTML = name;
  downloadImgBtn.setAttribute("data-img", img);
  lightBox.classList.add("show");
  document.body.style.overflow = "hidden";
};

const hideLightBox = () => {
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
};

const generateHTML = (images) => {
  imageWrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card" onclick="showLightBox('${img.photographer}', '${img.src.large2x}')">
          <img src="${img.src.large2x}" alt="img" />
          <div class="details">
            <div class="photograph">
              <i class="ri-camera-line"></i>
              <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
              <i class="ri-download-2-line"></i>
            </button>
          </div>
        </li>`
    )
    .join("");
};

const getImages = (apiURL) => {
  // Fetching images by API call with authorization Header
  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      generateHTML(data.photos);
      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch(() => alert("Failed to load Images!"));
};

const loadMoreImages = () => {
  currPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currPage}&per_page=${perPage}`;
  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currPage}&per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

const loadSearchImages = (e) => {
  // if the search input is empty, set the search term to null and return from here
  if (e.target.value === "") return (searchTerm = null);
  // If enter key is pressed, update the current page, search term & call the getImages
  if (e.key === "Enter") {
    currPage = 1;
    searchTerm = e.target.value;
    imageWrapper.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currPage}&per_page=${perPage}`
    );
  }
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currPage}&per_page=${perPage}`
);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightBox);
downloadImgBtn.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);