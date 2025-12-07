const CONTENT_PATH = 'data/content.json';
const PREVIEW_STORAGE_KEY = 'foodeeCmsPreview';

const state = {
	content: null
};

const getPreviewContent = () => {
	try {
		const raw = window.localStorage.getItem(PREVIEW_STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch (error) {
		console.warn('Foodee CMS preview verisi çözümlenemedi.', error);
		window.localStorage.removeItem(PREVIEW_STORAGE_KEY);
		return null;
	}
};

const loadContent = async () => {
	const preview = getPreviewContent();
	if (preview) {
		document.body.dataset.cmsPreview = 'true';
		return preview;
	}

	const response = await fetch(CONTENT_PATH, { cache: 'no-cache' });
	if (!response.ok) {
		throw new Error(`Content request failed with status ${response.status}`);
	}
	return response.json();
};

const renderSiteMeta = (site = {}) => {
	if (site.brand) {
		document.querySelectorAll('[data-brand]').forEach((el) => {
			el.textContent = site.brand;
		});
	}

	if (site.title) {
		document.title = site.title;
	}

	if (Array.isArray(site.nav)) {
		site.nav.forEach((item) => {
			const navLink = document.querySelector(
				`[data-nav-section="${item.section}"][data-nav-label]`
			);
			if (navLink && item.label) {
				navLink.textContent = item.label;
			}
		});
	}
};

const renderHero = (hero = {}) => {
	const titleEl = document.getElementById('hero-title');
	if (titleEl && hero.title) {
		titleEl.textContent = hero.title;
	}

	const subtitleEl = document.getElementById('hero-subtitle');
	if (subtitleEl && hero.subtitleHtml) {
		subtitleEl.innerHTML = hero.subtitleHtml;
	}

	const slidesEl = document.getElementById('hero-slides');
	const slideTemplate = document.getElementById('hero-slide-template');
	if (slidesEl && slideTemplate && Array.isArray(hero.slides)) {
		slidesEl.innerHTML = '';
		hero.slides.forEach((slide) => {
			const fragment = slideTemplate.content.cloneNode(true);
			const li = fragment.querySelector('li');
			if (li && slide.image) {
				li.style.backgroundImage = `url("${slide.image}")`;
				if (slide.parallaxRatio) {
					li.dataset.stellarBackgroundRatio = slide.parallaxRatio;
				}
			}
			slidesEl.appendChild(fragment);
		});
	}
};

const renderAbout = (about = {}) => {
	const headingEl = document.getElementById('about-heading');
	if (headingEl && about.heading) {
		headingEl.textContent = about.heading;
	}

	const descriptionEl = document.getElementById('about-description');
	if (descriptionEl && about.bodyHtml) {
		descriptionEl.innerHTML = about.bodyHtml;
	}

	const ctaEl = document.getElementById('about-cta');
	if (ctaEl) {
		if (about.cta?.label) {
			ctaEl.textContent = about.cta.label;
		}
		if (about.cta?.url) {
			ctaEl.href = about.cta.url;
		}
	}

	const imageEl = document.getElementById('about-image');
	if (imageEl && about.image) {
		imageEl.style.backgroundImage = `url(${about.image})`;
	}
};

const renderQuotes = (quotes = []) => {
	const listEl = document.getElementById('quotes-list');
	const template = document.getElementById('quote-template');
	if (!listEl || !template || !Array.isArray(quotes)) return;

	listEl.innerHTML = '';
	quotes.forEach((quote) => {
		const fragment = template.content.cloneNode(true);
		const textEl = fragment.querySelector('.quote-text');
		const authorEl = fragment.querySelector('.quote-author');
		if (textEl && quote.text) {
			textEl.textContent = quote.text;
		}
		if (authorEl && quote.author) {
			authorEl.textContent = `— ${quote.author}`;
		}
		listEl.appendChild(fragment);
	});
};

const renderMenu = (menu = {}) => {
	const headingEl = document.getElementById('menu-heading');
	if (headingEl && menu.title) {
		headingEl.textContent = menu.title;
	}

	const subheadingEl = document.getElementById('menu-subheading');
	if (subheadingEl && menu.subtitle) {
		subheadingEl.textContent = menu.subtitle;
	}

	const sectionsEl = document.getElementById('menu-sections');
	const sectionTemplate = document.getElementById('menu-section-template');
	const itemTemplate = document.getElementById('menu-item-template');
	if (sectionsEl && sectionTemplate && itemTemplate && Array.isArray(menu.sections)) {
		sectionsEl.innerHTML = '';
		menu.sections.forEach((section) => {
			const sectionFragment = sectionTemplate.content.cloneNode(true);
			const titleEl = sectionFragment.querySelector('.menu-section-title');
			const itemsEl = sectionFragment.querySelector('.menu-items');

			if (titleEl) {
				titleEl.textContent = section.title || '';
				titleEl.className = `menu-section-title ${section.style || ''}`.trim();
			}

			if (itemsEl) {
				itemsEl.innerHTML = '';
				(section.items || []).forEach((item) => {
					const itemFragment = itemTemplate.content.cloneNode(true);
					const itemTitleEl = itemFragment.querySelector('.menu-item-title');
					const itemDescEl = itemFragment.querySelector('.menu-item-description');
					const itemPriceEl = itemFragment.querySelector('.menu-item-price');
					const itemImageEl = itemFragment.querySelector('.menu-item-image');

					if (itemTitleEl && item.title) {
						itemTitleEl.textContent = item.title;
					}
					if (itemDescEl && item.description) {
						itemDescEl.textContent = item.description;
					}
					if (itemPriceEl && item.price) {
						itemPriceEl.textContent = item.price;
					}
					if (itemImageEl && item.image) {
						itemImageEl.src = item.image;
						itemImageEl.alt = item.title || 'Menu item';
					}

					itemsEl.appendChild(itemFragment);
				});
			}

			sectionsEl.appendChild(sectionFragment);
		});
	}

	const ctaEl = document.getElementById('menu-cta');
	if (ctaEl && menu.cta) {
		ctaEl.textContent = menu.cta.label || ctaEl.textContent;
		ctaEl.href = menu.cta.url || ctaEl.href;
	}
};

const renderEvents = (events = {}) => {
	const headingEl = document.getElementById('events-heading');
	if (headingEl && events.title) {
		headingEl.textContent = events.title;
	}

	const subheadingEl = document.getElementById('events-subheading');
	if (subheadingEl && events.subtitle) {
		subheadingEl.textContent = events.subtitle;
	}

	const listEl = document.getElementById('events-list');
	const template = document.getElementById('event-card-template');
	if (listEl && template && Array.isArray(events.items)) {
		listEl.innerHTML = '';
		events.items.forEach((event) => {
			const fragment = template.content.cloneNode(true);
			const titleEl = fragment.querySelector('.event-title');
			const dateEl = fragment.querySelector('.event-date');
			const descEl = fragment.querySelector('.event-description');
			const linkEl = fragment.querySelector('.event-link');

			if (titleEl && event.title) {
				titleEl.textContent = event.title;
			}
			if (dateEl && event.date) {
				dateEl.textContent = event.date;
			}
			if (descEl && event.description) {
				descEl.textContent = event.description;
			}
			if (linkEl && event.link) {
				linkEl.textContent = event.link.label || linkEl.textContent;
				linkEl.href = event.link.url || '#';
			}

			listEl.appendChild(fragment);
		});
	}
};

const renderProducts = (products = {}) => {
	console.log('renderProducts çağrıldı:', products);
	
	// Başlık ve alt başlık
	const headingEl = document.getElementById('products-heading');
	if (headingEl && products.title) {
		headingEl.textContent = products.title;
	}

	const subheadingEl = document.getElementById('products-subheading');
	if (subheadingEl && products.subtitle) {
		subheadingEl.textContent = products.subtitle;
	}

	// Swiper slides container
	const slidesContainer = document.getElementById('product-slides');
	if (!slidesContainer || !Array.isArray(products.items)) return;

	// Slide'ları oluştur
	slidesContainer.innerHTML = '';
	products.items.forEach((product) => {
		const slide = document.createElement('div');
		slide.className = 'swiper-slide';
		slide.innerHTML = `
			<div class="product-slide">
				<div class="product-slide-image" style="background-image: url('${product.image}')"></div>
				<div class="product-slide-content">
					<h3>${product.title}</h3>
					<div class="product-price">${product.price}</div>
					<p>${product.description}</p>
					<a href="product-detail.html?id=${product.id}" class="btn-details">View Details</a>
				</div>
			</div>
		`;
		slidesContainer.appendChild(slide);
	});

	// Swiper'ı başlat
	if (typeof Swiper !== 'undefined') {
		new Swiper('.product-swiper', {
			slidesPerView: 1,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 4000,
				disableOnInteraction: false,
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			breakpoints: {
				640: {
					slidesPerView: 2,
				},
				1024: {
					slidesPerView: 3,
				},
			},
		});
		console.log('Product Swiper başlatıldı.');
	}
};

const openAnnouncementModal = (announcement) => {
	if (!announcement) return;
	const modalTitle = document.getElementById('announcementModalLabel');
	const modalDate = document.getElementById('announcementModalDate');
	const modalBody = document.getElementById('announcementModalBody');
	const modalImage = document.getElementById('announcementModalImage');
	const modalAttachWrap = document.getElementById('announcementModalAttachments');
	const modalAttachList = document.getElementById('announcementModalAttachmentList');

	if (modalTitle) modalTitle.textContent = announcement.title || 'Duyuru';
	if (modalDate) modalDate.textContent = announcement.date || '';
	if (modalBody) modalBody.innerHTML = announcement.body || '';

	if (modalImage) {
		if (announcement.image) {
			modalImage.style.display = 'block';
			modalImage.style.backgroundImage = `url('${announcement.image}')`;
		} else {
			modalImage.style.display = 'none';
		}
	}

	if (modalAttachWrap && modalAttachList) {
		if (Array.isArray(announcement.attachments) && announcement.attachments.length) {
			modalAttachList.innerHTML = '';
			announcement.attachments.forEach((att) => {
				const li = document.createElement('li');
				li.innerHTML = `<a href="${att.url}" target="_blank">${att.label || att.url} (${att.type || ''})</a>`;
				modalAttachList.appendChild(li);
			});
			modalAttachWrap.style.display = 'block';
		} else {
			modalAttachWrap.style.display = 'none';
		}
	}

	if (typeof $ !== 'undefined' && $('#announcementModal').modal) {
		$('#announcementModal').modal('show');
	}
};

const renderAnnouncements = (ann = {}) => {
	const listEl = document.getElementById('announcement-list');
	if (!listEl) return;

	// Hem dizi hem { items: [] } yapısını destekle
	const items = Array.isArray(ann) ? ann : Array.isArray(ann.items) ? ann.items : [];
	if (!items.length) {
		listEl.innerHTML = '<div class="col-md-12"><p>Şu an duyuru bulunmuyor.</p></div>';
		const moreBtn = document.getElementById('announcements-more');
		if (moreBtn) moreBtn.style.display = 'none';
		return;
	}

	// En yeni -> eski
	const sorted = [...items].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
	const firstFive = sorted.slice(0, 5);

	listEl.innerHTML = '';
	firstFive.forEach((item) => {
		const col = document.createElement('div');
		col.className = 'col-md-4 col-sm-6';
		col.innerHTML = `
			<div class="fh5co-event" style="cursor:pointer;">
				<h3>${item.title}</h3>
				<span class="fh5co-event-meta">${item.date || ''}</span>
				<p>${item.summary || ''}</p>
				<p><a href="#" class="btn-details-ann">Detay</a></p>
			</div>
		`;
		col.onclick = (e) => {
			e.preventDefault();
			openAnnouncementModal(item);
		};
		listEl.appendChild(col);
	});

	const moreBtn = document.getElementById('announcements-more');
	if (moreBtn) {
		moreBtn.style.display = sorted.length ? 'inline-block' : 'none';
	}
};

const renderContact = (contact = {}) => {
	const headingEl = document.getElementById('contact-heading');
	if (headingEl && contact.title) {
		headingEl.textContent = contact.title;
	}

	const subheadingEl = document.getElementById('contact-subheading');
	if (subheadingEl && contact.subtitle) {
		subheadingEl.textContent = contact.subtitle;
	}

	const addressEl = document.getElementById('contact-address');
	if (addressEl && contact.addressHtml) {
		addressEl.innerHTML = contact.addressHtml;
	}

	const phoneEl = document.getElementById('contact-phone');
	if (phoneEl && contact.phone) {
		phoneEl.textContent = contact.phone.label || contact.phone.value || '';
		if (contact.phone.value) {
			phoneEl.href = `tel:${contact.phone.value.replace(/\s+/g, '')}`;
		}
	}

	const emailEl = document.getElementById('contact-email');
	if (emailEl && contact.email) {
		emailEl.textContent = contact.email;
		emailEl.href = `mailto:${contact.email}`;
	}

	const websiteEl = document.getElementById('contact-website');
	if (websiteEl && contact.website) {
		websiteEl.textContent = contact.website.label || contact.website.url || '';
		if (contact.website.url) {
			websiteEl.href = contact.website.url;
		}
	}

	const buttonEl = document.getElementById('contact-button');
	if (buttonEl && contact.buttonLabel) {
		buttonEl.value = contact.buttonLabel;
	}
};

const renderSite = (content) => {
	state.content = content;
	renderSiteMeta(content.site);
	renderHero(content.hero);
	renderAbout(content.about);
	renderAnnouncements(content.announcements);
	renderProducts(content.products);
	renderQuotes(content.quotes);
	renderMenu(content.menu);
	renderEvents(content.events);
	renderContact(content.contact);

	window.dispatchEvent(
		new CustomEvent('foodee:contentReady', {
			detail: { content }
		})
	);
};

const loadThemeScripts = () =>
	new Promise((resolve, reject) => {
		if (document.body.dataset.themeLoaded) {
			resolve();
			return;
		}

		const script = document.createElement('script');
		script.src = 'js/main.js';
		script.onload = () => {
			document.body.dataset.themeLoaded = 'true';
			resolve();
		};
		script.onerror = reject;
		document.body.appendChild(script);
	});

const bootstrap = async () => {
	try {
		const content = await loadContent();
		renderSite(content);
	} catch (error) {
		console.error('Foodee content could not be loaded.', error);
	} finally {
		loadThemeScripts().catch((themeError) => {
			console.error('Theme scripts could not be initialized.', themeError);
		});
	}
};

bootstrap();
