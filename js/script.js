// Функция для переключения вкладок
document.addEventListener("DOMContentLoaded", function () {
  // Получаем все кнопки вкладок
  const tabButtons = document.querySelectorAll(".tab-button");
  // Получаем все контейнеры с контентом вкладок
  const tabContents = document.querySelectorAll(".tab-content");
  // Получаем инпут поиска
  const searchInput = document.getElementById("search-input");

  // Функция для подсчета видимых карточек в вкладке
  function updateTabCounts() {
    tabButtons.forEach((button) => {
      const tabId = button.getAttribute("data-tab");
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        const productCards = tabContent.querySelectorAll(".product-card");
        // Считаем только видимые карточки
        let visibleCount = 0;
        productCards.forEach((card) => {
          if (
            card.style.display !== "none" &&
            !card.classList.contains("filtered-out")
          ) {
            visibleCount++;
          }
        });
        const countElement = button.querySelector(".tab-count");
        if (countElement) {
          countElement.textContent = visibleCount;
        }
      }
    });
  }

  // Функция для фильтрации карточек по названию с анимацией
  function filterCards(searchTerm) {
    const allCards = document.querySelectorAll(".product-card");
    const noResultsMessage = document.getElementById("no-results-message");
    let visibleCount = 0;

    // Сначала скрываем все карточки, которые не соответствуют поиску
    allCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const speaker = card.querySelector(".speaker")
        ? card.querySelector(".speaker").textContent.toLowerCase()
        : "";
      const category = card.querySelector(".badge span")
        ? card.querySelector(".badge span").textContent.toLowerCase()
        : "";

      const isVisible =
        title.includes(searchTerm.toLowerCase()) ||
        speaker.includes(searchTerm.toLowerCase()) ||
        category.includes(searchTerm.toLowerCase());

      if (isVisible) {
        card.classList.remove("filtered-out");
        // Даем время для анимации, затем ставим правильное отображение
        setTimeout(() => {
          if (!card.classList.contains("filtered-out")) {
            card.style.display = "flex";
          }
        }, 10);
        visibleCount++;
      } else {
        card.classList.add("filtered-out");

        if (card.classList.contains("filtered-out")) {
          card.style.display = "none";
        }
      }
    });

    // Показываем или скрываем сообщение об отсутствии результатов
    if (searchTerm && visibleCount === 0) {
      noResultsMessage.style.display = "block";
    } else {
      noResultsMessage.style.display = "none";
    }

    // Обновляем счетчики вкладок
    updateTabCounts();
  }

  // Обработчик события ввода в поле поиска
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim();
    filterCards(searchTerm);
  });

  // Обновляем счетчики при загрузке страницы
  updateTabCounts();

  // Добавляем обработчики кликов на кнопки вкладок с View Transition
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Проверяем поддержку View Transitions API
      if (!document.startViewTransition) {
        // Если View Transitions не поддерживаются, используем обычную логику
        // Получаем ID вкладки, которую нужно открыть
        const tabId = this.getAttribute("data-tab");

        // Убираем активный класс со всех кнопок и контента
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        // Добавляем активный класс к текущей кнопке
        this.classList.add("active");

        // Показываем соответствующий контент
        document.getElementById(tabId).classList.add("active");

        // Обновляем счетчики при переключении вкладок
        updateTabCounts();
        return;
      }

      // Используем View Transitions API для плавных анимаций при переключении вкладок
      document
        .startViewTransition(() => {
          // Получаем ID вкладки, которую нужно открыть
          const tabId = this.getAttribute("data-tab");

          // Убираем активный класс со всех кнопок и контента
          tabButtons.forEach((btn) => btn.classList.remove("active"));
          tabContents.forEach((content) => content.classList.remove("active"));

          // Добавляем активный класс к текущей кнопке
          this.classList.add("active");

          // Показываем соответствующий контент
          document.getElementById(tabId).classList.add("active");
        })
        .finished.then(() => {
          // Обновляем счетчики вкладок после завершения анимации
          updateTabCounts();
        });
    });
  });
});
