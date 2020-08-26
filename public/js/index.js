document.querySelectorAll("[data-enable]").forEach(el => {
    el.addEventListener("click", function() {
      const target = document.getElementById(this.dataset.enable)
  
      target.disabled = !target.disabled
  
      if (target.type === "file") {
        target.closest("form").enctype = target.disabled ? "application/x-www-form-urlencoded" : "multipart/form-data"
      }
  
      if (!target.disabled) {
        target.click()
      }
    })
  })
  
  document.querySelectorAll("[data-like-project]").forEach(el => {
    el.addEventListener("click", function () {
      axios.post(`/projects/${this.dataset.likeProject}/like`)
        .then(response => {
          const likesContainer = this.querySelector(".likes-count")
  
          likesContainer.innerText = Number(likesContainer.innerText) + response.data.like
        })
    })
  })
  