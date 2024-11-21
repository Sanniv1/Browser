document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const goBtn = document.getElementById('goBtn');
    const webview = document.getElementById('webview');
    const backBtn = document.getElementById('backBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const newTabBtn = document.getElementById('newTabBtn');
    const tabsContainer = document.querySelector('.tabs-container');

    let activeTab = document.querySelector('.tab');
    let tabs = [{
        id: 'tab-1',
        url: 'about:blank',
        title: 'New Tab'
    }];

    // Handle URL navigation
    function navigateToUrl() {
        let url = urlInput.value;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        webview.loadURL(url);
        urlInput.value = url;
        
        // Update current tab's URL
        const activeTabId = activeTab.getAttribute('data-tab-id');
        const tab = tabs.find(t => t.id === activeTabId);
        if (tab) {
            tab.url = url;
        }
    }

    // Refresh functionality
    refreshBtn.addEventListener('click', () => {
        webview.reload();
    });

    // Tab management
    function createNewTab() {
        const tabId = 'tab-' + (tabs.length + 1);
        
        // Create new tab object
        const newTabData = {
            id: tabId,
            url: 'about:blank',
            title: 'New Tab'
        };
        tabs.push(newTabData);

        // Create tab element
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.setAttribute('data-tab-id', tabId);
        
        // Create tab content wrapper and title
        const tabContent = document.createElement('span');
        tabContent.className = 'tab-content';
        tabContent.textContent = 'New Tab';
        
        // Create close button
        const closeBtn = document.createElement('span');
        closeBtn.className = 'tab-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent tab switching when clicking close
            closeTab(tab, tabId);
        });
        
        // Assemble tab
        tab.appendChild(tabContent);
        tab.appendChild(closeBtn);
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        
        // Add active class to new tab
        tab.classList.add('active');
        activeTab = tab;
        
        // Insert tab into the tabs container
        tabsContainer.appendChild(tab);

        // Reset webview and URL input
        webview.src = 'about:blank';
        urlInput.value = '';

        // Add click handler to the new tab
        tab.addEventListener('click', () => switchTab(tab, newTabData));

        // Scroll to the new tab
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function switchTab(tabElement, tabData) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tabElement.classList.add('active');
        activeTab = tabElement;

        // Update webview and URL input
        webview.src = tabData.url;
        urlInput.value = tabData.url;
    }

    // Add close tab function
    function closeTab(tabElement, tabId) {
        // Don't close if it's the last tab
        if (tabs.length === 1) {
            return;
        }

        // Find the index of the tab to remove
        const tabIndex = tabs.findIndex(t => t.id === tabId);
        
        // Remove tab from our tabs array
        tabs.splice(tabIndex, 1);
        
        // If the closed tab was active, activate another tab
        if (tabElement.classList.contains('active')) {
            // Try to activate the tab to the left, if not available activate the first tab
            const newActiveTab = tabElement.previousElementSibling || tabsContainer.firstElementChild;
            if (newActiveTab) {
                const newActiveTabId = newActiveTab.getAttribute('data-tab-id');
                const newTabData = tabs.find(t => t.id === newActiveTabId);
                switchTab(newActiveTab, newTabData);
            }
        }
        
        // Remove the tab element
        tabElement.remove();
    }

    // Add click handler to existing tab
    activeTab.setAttribute('data-tab-id', 'tab-1');
    activeTab.addEventListener('click', () => switchTab(activeTab, tabs[0]));

    // Event Listeners
    goBtn.addEventListener('click', navigateToUrl);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            navigateToUrl();
        }
    });

    backBtn.addEventListener('click', () => {
        if (webview.canGoBack()) {
            webview.goBack();
        }
    });

    forwardBtn.addEventListener('click', () => {
        if (webview.canGoForward()) {
            webview.goForward();
        }
    });

    newTabBtn.addEventListener('click', (e) => {
        newTabBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            newTabBtn.style.transform = 'scale(1)';
        }, 100);
        createNewTab();
    });

    // Optional: Add keyboard shortcut for new tab (Ctrl/Cmd + T)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            createNewTab();
        }
    });

    // Update tab title and URL
    webview.addEventListener('page-title-updated', (e) => {
        const activeTabId = activeTab.getAttribute('data-tab-id');
        const tab = tabs.find(t => t.id === activeTabId);
        if (tab) {
            tab.title = e.title;
            activeTab.textContent = e.title;
        }
    });

    webview.addEventListener('did-navigate', (e) => {
        urlInput.value = e.url;
        const activeTabId = activeTab.getAttribute('data-tab-id');
        const tab = tabs.find(t => t.id === activeTabId);
        if (tab) {
            tab.url = e.url;
        }
    });

    // Optional: Add loading indicator
    webview.addEventListener('did-start-loading', () => {
        refreshBtn.textContent = '×';
    });

    webview.addEventListener('did-stop-loading', () => {
        refreshBtn.textContent = '↻';
    });

    // Update the initial tab to have a close button
    const initialTab = document.querySelector('.tab');
    const tabContent = document.createElement('span');
    tabContent.className = 'tab-content';
    tabContent.textContent = 'New Tab';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'tab-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(initialTab, 'tab-1');
    });
    
    initialTab.innerHTML = '';
    initialTab.appendChild(tabContent);
    initialTab.appendChild(closeBtn);
}); 