# Sobre o produto final

Desenvolvi o projeto buscando seguir à risca a especificação tanto em relação aos requisitos quanto ao layout proposto. Para facilitar a navegação e melhorar a usabilidade fiz algumas alterações, as quais descrevo no decorrer do documento.

Todas as funcionalidades foram implementadas, porém faltaram alguns ajustes relacionados a responsividade devido a falta de tempo hábil (Veja a seção "A implementar").

## Tecnologias utilizadas

Para o desenvolvimento do aplicativo utilizei as seguintes ferramentas e tecnologias:

  - Linux CentOS 7
  - Node 8.11.2 (apenas devido ao NPM)
  - NPM 6.1.0
  - Angular CLI 6.0.5
  - Angular 6.0.3
  - TypeScript 2.7.2
  - RXJS 6.2.0
  - Webpack 4.8.3
  - HTML5, CSS3, Sass e JavaScript (ES6)
  - Visual Studio Code for Linux 1.23.1

## Telas da aplicação

A aplicação ficou dividida logicamente em 4 telas:

  - Tela 1: Seleção de filme.
  - Tela 2: Abertura do filme.
  - Tela 3: Tela de transição.
  - Tela 4: Tela de personagens do filme selecionado.

### Tela 1 - Seleção de filme

A tela de seleção de filme tem as seguintes características:

  - Composta por um fundo preto com estrelas brancas criadas e renderizadas dinamicamente via JavaScript.
  - Nenhuma imagem foi utilizada. Os textos utilizam uma fonte estilizada no estilo do filme.
  - No topo há uma indicação do episódio selecionado e duas setas que permitem selecionar o episódio.
  - No centro é exibido o título do episódio selecionado.
  - Abaixo do símbolo há um link para continuar e visualizar os dados do episódio.

Responsividade:

  - Deve se adaptar bem a qualquer dispositivo.

Componente relacionado: HomeComponent.

### Tela 2 - Abertura do filme

Não fazia parte da especificação, mas decidi implementar a abertura animada semelhante a do filme.

São características desta tela:

  - Primeiro é exibido o texto "A long time ago, in a galaxy far, far away...".
  - Alguns segundos depois surge o símbolo Star Wars. Neste momento é iniciada a execução da música tema do filme (Star Wars Theme, de John Williams).
  - Após o símbolo é exibido o texto de apresentação do filme, com a inclinação e velocidades semelhantes as do filme.
  - No canto superior esquerdo é exibido o símbolo da Aliança Rebelde, que permite o retorno a tela inicial (Tela 1).
  - No canto superiro direito há um link (skip) para pular a abertura do filme.

Responsividade:

  - Deve funcionar bem em resoluções mais altas, mas não houve tempo hábil para realizar as adaptações para equipamentos mobile.

Componente relacionado: HomeComponent.

### Tela 3 - Transição

  - Esta tela, com um fundo amarelo, exibe o símbolo do filme e o título do episódio centralizados, além de uma barra de progresso na parte inferior.
  - Foi criada com o principal objetivo de diminuir aos poucos o volume da música tema e evitar uma transição muito brusca entre as páginas.

Responsividade:

  - Deve se adaptar bem a qualquer dispositivo.

Componente relacionado: HomeComponent.

## Tela 4 - Personagens do filme selecionado

Esta tela é mais complexa que as demais. Tem as seguintes características:

  - O símbolo da aliança rebelde do canto superior esquerdo leva a página inicial.
  - Centralizado no topo da tela é exibido o título do episódio selecionado entre duas setas que permitem alterar rapidamente entre os episódios.
  - Na lateral esquerda são exibidos os personagens que fazem parte do episódio selecionado.
  - Na direita há uma área para onde os personangens devem ser arrastados (Diferente do que está no layout achei melhor deixar sempre na parte superior).
  - Quando um personagem é arrastado para a área de drop seus dados são exibidos em um frame abaixo desta área.
    - O último item arrastado é exibido no topo.
    - Alguns itens da coluna da direita são exibidos com um 'loading' no primeiro acesso. Preferi buscar estes itens apenas no momento que são exibidos pela primeira vez.
    - Itens arrastados para a área de drop ficam desabilitados na coluna da esquerda. Se o personagem for removido da coluna da direita (clique no "X"), o item da coluna da esquerda volta a ser habilitado.
  - Todos os dados relacionados ao filme (assim como a lista de filmes existentes) são adicionados ao Local Storage do navegador, então só haverá uma requisição ao servidor na primeira exibição do item.

Responsividade:

  - Falta realizar alguns ajustes relacionados a transição de telas para funcionar perfeitamente em dispositivos móveis.
  - Deve funcionar bem em resoluções mais altas.

## Estrutura do projeto

Após realizar um fork do repositório principal e cloná-lo em minha máquina, utilizei o comando 'ng new' do Angular CLI dentro do diretório 'code' para criar o projeto. Todo o código está dentro do diretório 'StarWars'.

Os arquivos importantes são:

  - package.json: Contém as dependências do projeto.
  - node_modules/: Diretório onde são instaladas as dependências.
  - src/: Contém toda a lógica.
    - app/: Contém componentes, services, interfaces, etc...
      - _enums/: Não utilizado, mas poderia conter enumarators.
      - _interfaces/: Arquivos com interfaces que representam a estrutura dos objetos (filmes, personagens, planetas, etc.).
      - _pipes/: Métodos utilizados para alterar em tempo de execução valores que são exibidos na tela (converte uma medida de centímetros para metros, por exemplo).
      - _services/: Serviços com métodos que podem ser utilizados de qualquer lugar da aplicação.
      - characters/: Contém todo o código (controladores, views, estilos, ...) relacionados a tela 4.
      - home/: Contém todo o código relacionado as telas 1, 2 e 3.
      - notfound/: Contém o código da página que é chamada quando um endereço não é localizado (falta estilizar).
      - app-routing.module.ts: Configuração de roteamento.
      - app.component.*: Arquivos relacionados so componente principal (bootstrap) da aplicação.
      - app.module.ts: Configurações gerais do projeto (imports de arquivos globais, etc.).
    - assets: Armazena o conteúdo estático.
      - audio: Contém o arquivo .mp3 com a música tema do filme.
      - fonts: Contém a fonte utilizada nos formatos EOT, SVG, TTF e WOFF.
      - images: Contém as imagens utilizadas (o símbolo da aliança rebelde é a única imagem).
      - styles: Contém arquivos SCSS com configurações de estilo globais.
    - environments: Configurações relacionadas aos ambientes de execução (development, production, ...).
    - favicon.ico: Ícone da aplicação, geralmente exibido na barra de título do navegador, nos bookmarks ou em atalhos criados.
    - main.ts: Arquivo principal (bootstrap) da aplicação.
    - index.html: Documento HTML que serve como master page para os demais.

## Executando o projeto

Preparando o ambiente:

  - Clone o repositório.
  - Acesse o diretório 'StarWars' e execute 'npm install' para instalar as dependências (requer o Node instalado).

Executando em ambiente de desenvolvimento:

  - Execute 'ng serve --open'. Deve abrir o navegador automaticamente apontando para 'http://localhost:4200'.
  - Se a porta não estiver disponível pode usar 'ng serve --port=4300' (por exemplo) para executar em outra porta.

Executando em ambiente de produção:

  - [Falta testar]

# A implementar

Algumas coisas não puderam ser implementadas devido a falta de tempo hábil. Entre elas estão:

  - Ajustes relacionados a responsividade (deve funcionar bem em desktop, mas há problemas conhecidos em ambientes móveis).
  - Implementar todos os testes.
  - Testar em ambiente Windows e em outros navegadores (testei no Chrome apenas).

# Observações finais

Algumas observações:

  - Poderia ter utilizado o IndexedDB para armazenar localmente os dados dos filmes. Optei pelo Local Storage para ganhar tempo.
  - Não utilizei o GraphQL.
  - Trabalhei sempre em uma branch 'development'. Ao longo do processo criei algumas tags (v0.1, v0.2, ...) e fiz merge na branch 'master' após a criação das tags.