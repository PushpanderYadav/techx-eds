function createOptimizedPicture(
  src,
  alt = "",
  eager = false,
  breakpoints = [
    { media: "(min-width: 600px)", width: "2000" },
    { width: "750" },
  ]
) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement("picture");
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf(".") + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement("source");
    if (br.media) source.setAttribute("media", br.media);
    source.setAttribute("type", "image/webp");
    source.setAttribute(
      "srcset",
      `${pathname}?width=${br.width}&format=webply&optimize=medium`
    );
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement("source");
      if (br.media) source.setAttribute("media", br.media);
      source.setAttribute(
        "srcset",
        `${pathname}?width=${br.width}&format=${ext}&optimize=medium`
      );
      picture.appendChild(source);
    } else {
      const img = document.createElement("img");
      img.setAttribute("loading", eager ? "eager" : "lazy");
      img.setAttribute("alt", alt);
      picture.appendChild(img);
      img.setAttribute(
        "src",
        `${pathname}?width=${br.width}&format=${ext}&optimize=medium`
      );
    }
  });

  return picture;
}

function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement) {
      el.append(html);
    } else {
      el.insertAdjacentHTML("beforeend", html);
    }
  }
  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      el.setAttribute(key, attributes[key]);
    });
  }
  return el;
}

const CURSOR_BLINK = 580; // in milliseconds

function debounce(func, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout); // clear previous timer
    timeout = setTimeout(() => func(...args), delay); // start new timer
  };
}

function generateIndex(prevIndex, range) {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * range);
  } while (newIndex === prevIndex); // repeat if new index matches previous index
  return newIndex;
}

function identifySource(a) {
  const fallback = "/query-index.json";
  console.log(fallback);
  if (!a) return fallback;
  const { pathname } = new URL(a.href);
  return pathname || fallback;
}

export async function fetchSourceData(index, faq = "") {
  if (window.docs && window.docs.length > 0) return window.docs;
  try {
    const resp = await fetch(index);
    const json = await resp.json();
    // return json.data ? json.data : [];
    window.docs = json.data ? json.data : [];
    if (faq) {
      // eslint-disable-next-line no-use-before-define
      const faqResp = await fetchSourceDataHTML(faq);
      window.docs.push(...faqResp);
    }
    return window.docs;
  } catch (error) {
    return [];
  }
}

export async function fetchSourceDataHTML(index) {
  try {
    const resp = await fetch(index);
    console.log(resp);
    const html = await resp.text();
    // parse the html and return array of sections
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    console.log(doc);
    const sections =
      [...doc.querySelectorAll("h3")].map((h3) => h3.parentElement) || [];
    window.docs.push(...sections);
    const image = doc.querySelector('meta[property="og:image"]')?.content || "";
    window.faqImage = image;
    // console.log(sections);
    return sections;
  } catch (error) {
    return [];
  }
}

function buildSearchIcon() {
  // helper to create elements using the svg namespace
  const createNS = (tag) =>
    document.createElementNS("http://www.w3.org/2000/svg", tag);
  const svg = createNS("svg");
  ["width", "height"].forEach((attr) => svg.setAttribute(attr, "24"));
  svg.setAttribute("viewBox", "0 0 24 24");
  const path = createNS("path");
  path.setAttribute(
    "d",
    `M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5
    16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z`
  );
  svg.appendChild(path);
  return svg;
}

function highlightTerms(terms, els) {
  els.forEach((el) => {
    const matches = [];
    const text = el.textContent;
    // find all matching terms and store their offsets
    terms.forEach((term) => {
      const offset = text.toLowerCase().indexOf(term);
      if (offset >= 0) matches.push({ offset, term });
    });
    // sort matches by offset to ensure proper highlighting order
    matches.sort((a, b) => a.offset - b.offset);
    let highlighted = "";
    // if no matches are found, nothing to highlight
    if (!matches.length) highlighted = text;
    else {
      highlighted = text.slice(0, matches[0].offset);
      matches.forEach((match, i) => {
        highlighted += `<mark class="side-nav-search-highlight">${text.slice(
          match.offset,
          match.offset + match.term.length
        )}</mark>`;
        // add highlighted text between current and next match
        if (matches.length - 1 === i) {
          highlighted += text.slice(match.offset + match.term.length);
        } else {
          highlighted += text.slice(
            match.offset + match.term.length,
            matches[i + 1].offset
          );
        }
      });
      el.innerHTML = highlighted;
    }
  });
}

function loadSearch(input, docs, resultsContainer, isHomepage) {
  let searchTerm;
  if (/[?&]q=/.test(window.location.search)) {
    const searchParams = new URLSearchParams(window.location.search);
    searchTerm = searchParams.get("q");
  }

  if (searchTerm) {
    input.value = searchTerm;
    // eslint-disable-next-line no-use-before-define
    searchQuery(searchTerm, docs, resultsContainer, isHomepage);
  }
}

function buildResult(match, terms, isHomepage) {
  if (!match) return null; // eject if no match
  const result = createTag("a", { href: match.path });

  // write title and description
  const truncate = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const title = createTag("p", {}, truncate(match.title));
  const desc = createTag("p", {}, truncate(match.description));
  highlightTerms(terms, [title, desc]);

  if (isHomepage) {
    const image = createOptimizedPicture(match.image, null, false, [
      { width: "20" },
    ]);
    result.append(title, desc);
    const li = createTag("li", { class: "doc-search-result" });
    li.append(result);
    return li;
  }

  // default result layout
  const image = createOptimizedPicture(match.image, null, false, [
    { width: "750" },
  ]);
  result.classList.add("article-card");
  const cardImage = createTag("div", { class: "article-card-image" }, image);
  const cardBody = createTag("div", { class: "article-card-body" });
  const span = createTag(
    "span",
    { class: "link-highlight-colorful-effect-2" },
    title.innerHTML
  );
  const h3 = createTag("h3", {}, span);
  const p = createTag("p", {}, desc);
  cardBody.append(h3, p);
  result.append(cardImage, cardBody);
  return result;
}

function displayNoResults(container, isHomepage) {
  const noResults = container.querySelector(".doc-search-no-result");
  noResults.setAttribute("aria-hidden", false);
  if (!isHomepage) {
    // for regular non-homepage search results
    const aside = container.closest("aside");
    if (aside && aside.classList.contains("expand"))
      aside.classList.remove("expand");
  }
}

export function displayResults(matches, terms, container, isHomepage) {
  // reset display
  container.setAttribute("aria-hidden", false);
  container
    .querySelector(".doc-search-no-result")
    .setAttribute("aria-hidden", true);
  if (!matches.length) {
    displayNoResults(container, isHomepage);
    return;
  }

  matches.forEach((match) => {
    const li = buildResult(match, terms, isHomepage);
    if (li) container.append(li);
  });
  container.classList.add("open");
  if (!isHomepage) container.closest("aside").classList.add("expand");
}

function hideResults(container) {
  container.setAttribute("aria-hidden", true);
}

function getIdFromSectionMetadata(section) {
  const sectionId = section.parentElement?.querySelector(
    ".section-metadata div div:nth-child(2)"
  ).textContent;
  return sectionId;
}

function createSearchResultObject(doc, terms, source) {
  const id = getIdFromSectionMetadata(doc);
  console.log(doc);
  return {
    title: doc.querySelector("h3")?.textContent || "",
    description: doc.querySelector("p")?.textContent || "",
    path: `/docs/faq#${id}` || "",
    image: window.faqImage || "/default-meta-image.jpg",
    content: doc.innerHTML,
    terms,
    source,
  };
}

function findDoc(query, docs = [], findMultiple = false) {
  if (docs.length) {
    // separate index and faq
    const indexDocs = [];
    const faqDocs = [];
    docs.forEach((doc) =>
      doc.title ? indexDocs.push(doc) : faqDocs.push(doc)
    );

    // split the query into terms, trimming and filtering out 1-2 letter and unhelpful words
    const filterOut = [
      "and",
      "but",
      "can",
      "eds",
      "for",
      "how",
      "the",
      "use",
      "what",
      "aem",
    ];
    const terms = query
      .toLowerCase()
      .split(" ")
      .map((e) => e.trim())
      .filter((e) => e.length > 2 && !filterOut.includes(e));
    if (!terms.length) return { terms, match: [] }; // eject if no valid search terms

    // Search through faq and index docs and return both matches
    const perfectMatches = new Set();
    const strongMatches = new Set();
    const fallbackMatches = new Set();

    // find "perfect" matches (every term matches title or faq question)
    indexDocs.forEach((doc) => {
      if (terms.every((term) => doc.title.toLowerCase().includes(term))) {
        perfectMatches.add(doc);
      }
    });
    faqDocs.forEach((doc) => {
      if (
        [...doc.querySelectorAll("h3")].some((q) =>
          terms.every((term) => q.textContent.toLowerCase().includes(term))
        )
      ) {
        perfectMatches.add(createSearchResultObject(doc, terms, "faq"));
        console.log(perfectMatches);
      }
    });
    // eject if we have 3 results at least to show
    if (!findMultiple && perfectMatches.size >= 3)
      return { terms, match: [...perfectMatches] };

    // find strong matches (some terms match title or faq question)
    indexDocs.forEach((doc) => {
      if (terms.some((term) => doc.title.toLowerCase().includes(term))) {
        strongMatches.add(doc);
      }
    });
    faqDocs.forEach((doc) => {
      if (
        [...doc.querySelectorAll("h3")].some((q) =>
          terms.some((term) => q.textContent.toLowerCase().includes(term))
        )
      ) {
        strongMatches.add(createSearchResultObject(doc, terms, "faq"));
      }
    });
    // eject if we have 3 results at least to show
    if (!findMultiple && perfectMatches.size + strongMatches.size >= 3) {
      return { terms, match: [...perfectMatches, ...strongMatches] };
    }

    // find weaker/fallback matches (some terms match content or faq answer}
    indexDocs.forEach((doc) => {
      if (
        terms.some((term) =>
          `${doc.title} ${doc.content}`.toLowerCase().includes(term)
        )
      ) {
        fallbackMatches.add(doc);
      }
    });
    faqDocs.forEach((doc) => {
      if (
        [...doc.querySelectorAll("p")].some((p) =>
          terms.some((term) => p.textContent.toLowerCase().includes(term))
        )
      ) {
        fallbackMatches.add(createSearchResultObject(doc, terms, "faq"));
      }
    });

    // aggregate matches
    const matches = [...perfectMatches, ...strongMatches, ...fallbackMatches];
    return { terms, match: findMultiple ? matches : matches.slice(0, 3) };
  }
  return { terms: query, match: null };
}

/**
 * Responds to search queries.
 * @param {HTMLInputElement} search - Search input.
 * @param {Array} docs - Array of documents to search.
 * @param {HTMLElement} results - Results container.
 * @param {boolean} isHomepage - Whether the block is a homepage variant.
 */
function searchQuery(search, docs, results, isHomepage) {
  console.log(docs);
  if (docs.length && search.trim()) {
    // clear previous results
    if (isHomepage) {
      results.querySelectorAll(".doc-search-result").forEach((r) => r.remove());
    } else {
      results.querySelectorAll(".article-card").forEach((r) => r.remove());
    }

    // search for matching documentinn
    const { match, terms } = findDoc(search, docs, !isHomepage);
    if (match) {
      const uniqueMatches = Array.isArray(match)
        ? [...new Map(match.map((item) => [item.path, item])).values()]
        : match;
      if (isHomepage) {
        displayResults(uniqueMatches.slice(0, 3), terms, results, isHomepage);
      } else {
        displayResults(uniqueMatches, terms, results, isHomepage);
      }
    } else {
      displayNoResults(results, isHomepage);
    }
  } else {
    hideResults(results);
  }
}

function isRotating(input) {
  return input.dataset.rotate === "true";
}

function forceStop(input) {
  if (input.dataset.interval) {
    const interval = parseInt(input.dataset.interval, 10);
    clearInterval(interval);
    input.removeAttribute("data-interval");
  }
}

function manageInterval(input, delay, cb) {
  forceStop(input);
  // create an interval to perform the animation
  const interval = setInterval(() => {
    if (!isRotating(input)) {
      forceStop(input);
      return;
    }
    cb(interval); // execute current animation step
  }, delay); // time between animation steps
  input.dataset.interval = interval;
}

function fadeOut(results) {
  results.classList.add("fade-out");
  // wait for .fade-out animation to complete, then remove
  setTimeout(() => {
    results.classList.remove("fade-out");
    hideResults(results);
  }, CURSOR_BLINK); // match timing set in .fade-out
}

function blink(input, cb, maxBlinks = 5) {
  let blinks = 0;
  manageInterval(input, CURSOR_BLINK, () => {
    input.placeholder =
      blinks % 2
        ? `${input.placeholder.slice(0, input.placeholder.length - 1)}`
        : `${input.placeholder}|`;
    blinks += 1;
    if (blinks >= maxBlinks) {
      forceStop(input); // stop blinking
      cb();
    }
  });
}

function type(placeholder, input, results, cb, isHomepage) {
  let i = 0;
  // calculate midpoint in type animation
  const midpoint = Math.floor(placeholder.length / 2);
  manageInterval(input, 40, () => {
    // add one character at a time to placeholder
    input.placeholder = placeholder.slice(0, i + 1);
    i += 1;
    if (i === midpoint) {
      // run search query against placeholder at midpoint
      searchQuery(
        placeholder.slice(0, placeholder.length - 1),
        window.docs,
        results,
        isHomepage
      );
    }
    if (i >= placeholder.length) {
      // check if full placeholder is displayed
      forceStop(input); // stop typing
      // scale delay based on placeholder length
      const delay = Math.ceil((placeholder.length * 200) / CURSOR_BLINK);
      blink(input, cb, delay); // trigger blink
    }
  });
}

function backspace(input, results, cb) {
  let i = input.placeholder.length;
  // calculate midpoint in backspace animation
  const midpoint = Math.floor(i / 2);
  manageInterval(input, 20, () => {
    // remove one character at a time from placeholder
    input.placeholder = input.placeholder.slice(0, i - 1);
    i -= 1;
    // hide query results at midpoint
    if (i === midpoint) fadeOut(results);
    if (i <= 0) {
      // check if placeholder has been removed
      forceStop(input); // stop backspacing
      blink(input, cb); // trigger blink
    }
  });
}

function rotatePlaceholder(
  currIndex,
  input,
  results,
  placeholders,
  isHomepage
) {
  if (!isRotating(input)) {
    forceStop(input);
    return;
  }
  const ph = placeholders[currIndex];
  type(
    ph,
    input,
    results,
    () => {
      // simulate typing
      if (!isRotating(input)) {
        forceStop(input);
        return;
      }
      backspace(input, results, () => {
        // simulate backspacing
        if (!isRotating(input)) {
          forceStop(input);
          return;
        }
        // generate next placeholder index randomly (without immediate repetition)
        const nextIndex = generateIndex(currIndex, placeholders.length);
        rotatePlaceholder(nextIndex, input, results, placeholders, isHomepage); // recursive call to loop
      });
    },
    isHomepage
  );
}

function findResultLink(results) {
  const links = results.querySelectorAll("a[href]");
  const result = links[links.length - 1];
  // only return link if visible to user
  return result.offsetParent ? result : null;
}

export default async function decorate(block) {
  // extract config
  const index = identifySource(block.querySelector("a[href]"));
  const faq = identifySource(block.querySelectorAll("a[href]")[1]) || "";
  // window.docs = [];
  const placeholders = [...block.querySelectorAll("li")].map(
    (li) => li.textContent
  );
  const isHomepage = block.classList.contains("homepage");
  // clear config
  const row = block.firstElementChild;
  row.innerHTML = "";

  // build search bar
  const form = createTag("form");
  const search = createTag("input", {
    type: "search",
    "aria-label": "Search the documentation",
  });
  const clear = createTag("button", { type: "reset" }, "✕");
  const icon = buildSearchIcon();
  form.append(icon, search, clear);
  row.append(form);

  // build results container
  let results;
  if (isHomepage) {
    results = createTag("ul", {
      class: "doc-search-results",
      "aria-hidden": true,
    });
    row.append(results);
  } else {
    const { resultsContainerClass } = block.dataset;
    results = document.querySelector(`.${resultsContainerClass}`);
  }
  const noResults = createTag(
    "li",
    { class: "doc-search-no-result", "aria-hidden": true },
    'We didn\'t find a good match. <a href="/docs/">Visit our documentation page</a> for more.'
  );
  results.append(noResults);
  // add functionality to search bar
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // on form submit, send user to most relevant result
    const link = findResultLink(results);
    if (link) {
      link.focus();
      setTimeout(() => {
        window.location.href = link.href;
      }, 65);
    }
  });
  clear.addEventListener("click", () => {
    search.focus();
    fadeOut(results);
  });
  search.addEventListener("focus", () => {
    search.dataset.rotate = false;
    forceStop(search);
    search.placeholder = "Search the documentation";
  });
  search.addEventListener("blur", () => {
    if (search.value === "" && isHomepage) {
      setTimeout(() => {
        search.dataset.rotate = true;
        rotatePlaceholder(
          generateIndex(-1, placeholders.length),
          search,
          results,
          placeholders,
          isHomepage
        );
      }, 1200);
    }
  });
  search.addEventListener("keyup", (e) => {
    const { key } = e;
    if (key === "ArrowDown") {
      const link = findResultLink(results);
      if (link) link.focus();
    }
  });

  // observer block to trigger animation and load docs
  const observer = new IntersectionObserver(async (entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      if (isHomepage) {
        // start placeholder rotation
        search.dataset.rotate = true;
        setTimeout(() => {
          rotatePlaceholder(
            generateIndex(-1, placeholders.length),
            search,
            results,
            placeholders,
            isHomepage
          );
        }, 600);
      }
      fetchSourceData(index, faq).then((docs) => {
        // enable search only after docs are available
        search.addEventListener(
          "input",
          debounce(() => {
            searchQuery(search.value, docs, results, isHomepage);
          }, 200)
        );
        if (!isHomepage) loadSearch(search, docs, results, isHomepage);
      });
    }
  });
  observer.observe(block);
}
