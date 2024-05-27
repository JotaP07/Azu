// Quando o botão com a classe 'switcher-btn' é clicado, esta função é acionada
document.querySelector('.switcher-btn').onclick = () => {
    // A função toggle alterna a classe 'active'. Se a classe existir, ela é removida; se não existir, ela é adicionada.
    document.querySelector('.color-switcher').classList.toggle('active');
};

// A variável themeButtons recebe todos os elementos com a classe 'theme-buttons'
let themeButtons = document.querySelectorAll('.theme-buttons');

// Para cada botão de tema, adicionamos um ouvinte de evento de clique
themeButtons.forEach(color => {

    // Quando o botão é clicado, esta função é acionada
    color.addEventListener('click', () => {
        // Obtemos o valor do atributo 'data-color' do botão clicado
        let dataColor = color.getAttribute('data-color');
        
        // Alteramos a variável CSS '--main-color' para o valor obtido
        document.querySelector(':root').style.setProperty('--main-color', dataColor);
        
        // Armazenamos o valor da cor no armazenamento local para persistência entre as sessões do navegador
        localStorage.setItem('bg-color', dataColor);
    });
});

// Quando o documento HTML é totalmente carregado, esta função é acionada
addEventListener('DOMContentLoaded', () =>{
    // Recuperamos a cor armazenada localmente e a definimos como a variável CSS '--main-color'
    document.querySelector(':root').style.setProperty('--main-color', (localStorage.getItem('bg-color')));
})