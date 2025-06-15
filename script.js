document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const envelope = document.getElementById('envelope');
    const letterContainer = document.getElementById('letterContainer');
    const pages = document.querySelectorAll('.page');
    const letterContent = document.querySelector('.letter-content');
    const prevArrow = document.getElementById('prevArrow');
    const nextArrow = document.getElementById('nextArrow');
    
    // Estado de la aplicación
    const state = {
        currentPage: 0,
        isOpen: false,
        isAnimating: false,
        totalPages: document.querySelectorAll('.page').length
    };

    // Funciones de navegación
    function showPage(pageIndex) {
        if (state.isAnimating || 
            pageIndex === state.currentPage || 
            pageIndex < 0 || 
            pageIndex >= state.totalPages) return;
        
        state.isAnimating = true;
        const direction = pageIndex > state.currentPage ? 'next' : 'prev';
        const previousPage = state.currentPage;
        state.currentPage = pageIndex;
        
        updateArrowStates();
        
        // Animación de salida
        pages[previousPage].classList.remove('active');
        pages[previousPage].classList.add(direction === 'next' ? 'prev' : 'next');
        
        // Animación de entrada
        pages[state.currentPage].classList.remove('prev', 'next');
        pages[state.currentPage].classList.add('active');
        
        // Reset scroll
        letterContent.scrollTop = 0;
        
        const finishAnimation = () => {
            state.isAnimating = false;
            updateArrowStates();
            pages[state.currentPage].removeEventListener('transitionend', finishAnimation);
        };
        
        pages[state.currentPage].addEventListener('transitionend', finishAnimation, {once: true});
        setTimeout(finishAnimation, 600);
    }
    
    function updateArrowStates() {
        prevArrow.classList.toggle('inactive', state.currentPage === 0);
        nextArrow.classList.toggle('inactive', state.currentPage === state.totalPages - 1);
    }
    
    // Funciones del sobre
    function openEnvelope() {
        envelope.classList.add('open');
        setTimeout(() => {
            envelopeWrapper.classList.add('minimized');
            envelope.classList.add('minimized');
            letterContainer.classList.add('open');
        }, 500);
    }
    
    function closeEnvelope() {
        letterContainer.classList.remove('open');
        envelope.classList.remove('open');
        setTimeout(() => {
            envelopeWrapper.classList.remove('minimized');
            envelope.classList.remove('minimized');
        }, 500);
    }
    
    function toggleEnvelope() {
        if (state.isAnimating) return;
        state.isOpen = !state.isOpen;
        state.isOpen ? openEnvelope() : closeEnvelope();
    }
    
    // Event listeners
    envelope.addEventListener('click', toggleEnvelope);
    
    prevArrow.addEventListener('click', function(e) {
        if (!state.isAnimating && state.currentPage > 0) {
            showPage(state.currentPage - 1);
        }
    });
    
    nextArrow.addEventListener('click', function(e) {
        if (!state.isAnimating && state.currentPage < state.totalPages - 1) {
            showPage(state.currentPage + 1);
        }
    });
    
    // Efecto hover flechas
    [prevArrow, nextArrow].forEach(arrow => {
        arrow.addEventListener('mouseenter', () => {
            if (!arrow.classList.contains('inactive')) {
                arrow.style.opacity = '1';
            }
        });
        
        arrow.addEventListener('mouseleave', () => {
            if (!arrow.classList.contains('inactive')) {
                arrow.style.opacity = '0.3';
            }
        });
    });
    
    letterContent.addEventListener('wheel', function(e) {
        this.scrollTop += e.deltaY;
        e.preventDefault();
    }, {passive: false});
    
    // Inicialización
    showPage(0);
});