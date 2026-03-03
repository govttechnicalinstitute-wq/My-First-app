const defaultVideos = [
  {
    id: 1,
    creator: "@citydrift",
    caption: "Midnight city drive vibes 🌃 #night",
    likes: 2341,
    audience: "all",
    comments: ["This view is unreal 🔥", "Need this soundtrack!"],
    src: "https://videos.pexels.com/video-files/3129957/3129957-hd_1080_1920_25fps.mp4",
  },
  {
    id: 2,
    creator: "@skywanderer",
    caption: "Cloud tunnel timelapse ☁️ #travel",
    likes: 1857,
    audience: "following",
    comments: ["So calming", "The colors are amazing"],
    src: "https://videos.pexels.com/video-files/7266740/7266740-hd_1080_1920_30fps.mp4",
  },
  {
    id: 3,
    creator: "@waveframe",
    caption: "Slow-mo ocean break 🌊 #beach",
    likes: 3218,
    audience: "all",
    comments: ["Looping this all day", "Ocean therapy 🌊"],
    src: "https://videos.pexels.com/video-files/854132/854132-hd_1080_1920_25fps.mp4",
  },
];

const feed = document.getElementById("feed");
const searchInput = document.getElementById("search-input");
const tabs = [...document.querySelectorAll(".tab")];
const createDialog = document.getElementById("create-dialog");
const createForm = document.getElementById("create-form");
const commentsDialog = document.getElementById("comments-dialog");
const commentsList = document.getElementById("comments-list");

const localPosts = JSON.parse(localStorage.getItem("looply-posts") ?? "[]");
let videos = [...localPosts, ...defaultVideos];
let filter = "all";
let query = "";

function persistPosts() {
  const customPosts = videos.filter((video) => video.id > 1000);
  localStorage.setItem("looply-posts", JSON.stringify(customPosts));
}

function filteredVideos() {
  return videos.filter((video) => {
    const matchesFilter = filter === "all" || video.audience === filter;
    const haystack = `${video.creator} ${video.caption}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  });
}

function renderFeed() {
  const list = filteredVideos();
  feed.innerHTML = "";

  if (!list.length) {
    feed.innerHTML = '<p style="padding:1rem;text-align:center;">No posts found.</p>';
    return;
  }

  list.forEach((item) => {
    const card = document.createElement("section");
    card.className = "video-card";

    card.innerHTML = `
      <video src="${item.src}" muted loop playsinline preload="metadata"></video>
      <div class="overlay">
        <div class="meta">
          <p class="creator">${item.creator}</p>
          <p class="caption">${item.caption}</p>
          <span class="badge">${item.audience === "following" ? "Following" : "For You"}</span>
        </div>
        <div class="actions">
          <button class="action-btn like-btn" aria-label="Like">❤</button>
          <p class="count like-count">${item.likes}</p>
          <button class="action-btn comment-btn" aria-label="Comment">💬</button>
          <button class="action-btn bookmark-btn" aria-label="Bookmark">🔖</button>
          <button class="action-btn share-btn" aria-label="Share">↗</button>
        </div>
      </div>
    `;

    const likeBtn = card.querySelector(".like-btn");
    const likeCount = card.querySelector(".like-count");
    const commentBtn = card.querySelector(".comment-btn");
    const bookmarkBtn = card.querySelector(".bookmark-btn");
    const shareBtn = card.querySelector(".share-btn");

    likeBtn.addEventListener("click", () => {
      const liked = likeBtn.classList.toggle("liked");
      item.likes += liked ? 1 : -1;
      likeCount.textContent = String(item.likes);
    });

    commentBtn.addEventListener("click", () => {
      commentsList.innerHTML = item.comments.map((text) => `<li>${text}</li>`).join("");
      commentsDialog.showModal();
    });

    bookmarkBtn.addEventListener("click", () => {
      bookmarkBtn.classList.toggle("bookmarked");
    });

    shareBtn.addEventListener("click", async () => {
      const link = `${location.origin}/#post-${item.id}`;
      await navigator.clipboard.writeText(link);
      shareBtn.textContent = "✓";
      setTimeout(() => {
        shareBtn.textContent = "↗";
      }, 900);
    });

    feed.appendChild(card);
  });

  setupAutoPlay();
}

function setupAutoPlay() {
  const videoNodes = [...document.querySelectorAll("video")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.72 }
  );

  videoNodes.forEach((video) => observer.observe(video));
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    filter = tab.dataset.filter;
    renderFeed();
  });
});

searchInput.addEventListener("input", (event) => {
  query = event.target.value;
  renderFeed();
});

document.getElementById("open-create").addEventListener("click", () => createDialog.showModal());
document.getElementById("close-create").addEventListener("click", () => createDialog.close());
document.getElementById("close-comments").addEventListener("click", () => commentsDialog.close());

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(createForm);
  const post = {
    id: Date.now(),
    creator: formData.get("creator"),
    caption: formData.get("caption"),
    likes: 0,
    audience: formData.get("audience"),
    comments: ["New post! Be the first to comment."],
    src: formData.get("src"),
  };

  videos = [post, ...videos];
  persistPosts();
  createForm.reset();
  createDialog.close();
  renderFeed();
});

renderFeed();
