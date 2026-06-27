Esta é uma excelente implementação de um **Middleware de Observabilidade (Telemetry)**. Arquiteturalmente, este componente atua como um *Observer* (Padrão de Projeto Observador), onde ele "se inscreve" no ciclo de vida da requisição para coletar métricas sem interferir na lógica de negócio principal.

Esta é uma análise técnica detalhada, linha por linha, do seu middleware `requestLogger`. O objetivo deste componente é realizar a **instrumentação de observabilidade** do tráfego HTTP.

Aqui está a decomposição arquitetural:

### 1. Declaração da Assinatura
```javascript
function requestLogger(req, res, next) {
```
*   **Função**: Middleware do Express.
*   **Análise**: Ele recebe o objeto de requisição (`req`), o objeto de resposta (`res`) e a função `next` que controla o fluxo. Por ser um middleware, ele tem acesso total ao ciclo de vida da requisição HTTP.

### 2. Captura do Timestamp Inicial
```javascript
  const startedAt = Date.now();
```
*   **Função**: Marcação de tempo.
*   **Análise**: Capturamos o tempo exato (em milissegundos) em que a requisição entrou na aplicação. Como o Node.js é single-threaded e orientado a eventos, essa variável `startedAt` é preservada através de uma **closure** dentro do escopo da função, garantindo que, mesmo com múltiplas requisições simultâneas, cada uma mantenha seu próprio `startedAt`.

### 3. Registro do Hook de Evento (O "Observer")
```javascript
  res.on("finish", () => {
```
*   **Função**: Escuta de evento assíncrono.
*   **Análise**: O objeto `res` (ServerResponse) do Node.js emite eventos durante seu ciclo de vida. O evento `"finish"` ocorre quando a resposta foi completamente enviada para o cliente. 
*   **Por que não logar imediatamente?**: Se logássemos antes do `next()`, teríamos o tempo de entrada, mas não o tempo de processamento. Ao usar `res.on("finish")`, estamos dizendo ao Node: *"Não execute este log agora; guarde este código e execute-o apenas quando a resposta terminar"*.

### 4. Cálculo de Latência
```javascript
    const elapsed = Date.now() - startedAt;
```
*   **Função**: Cálculo de delta-tempo.
*   **Análise**: Subtraímos o tempo atual (fim da requisição) pelo tempo capturado no início (`startedAt`). Isso nos dá a **latência real** do processamento daquela rota (incluindo tempo de banco de dados, lógica de negócio e latência de rede interna).

### 5. Saída de Log (Console)
```javascript
    console.log(`[custom-log] ${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsed}ms`);
```
*   **Função**: Saída de dados (Logging).
*   **Análise**:
    *   `${req.method}`: Identifica a verbosidade (GET, POST, etc).
    *   `${req.originalUrl}`: Identifica a rota exata (ex: `/api/products/1`).
    *   `${res.statusCode}`: Crucial para saber se a requisição foi um sucesso (200), um erro de cliente (400/404) ou um erro de servidor (500).
    *   `${elapsed}ms`: O dado de performance.

### 6. Continuidade do Fluxo
```javascript
  next();
}
```
*   **Função**: Controle de fluxo.
*   **Análise**: Essencial. Se você omitir o `next()`, a requisição ficará "pendurada" para sempre, pois o Express nunca passará para o próximo middleware ou para a rota final. Ao chamar `next()`, permitimos que a aplicação continue seu trabalho enquanto o "gancho" que criamos no `res.on` aguarda silenciosamente o término da resposta.

---

### Resumo Arquitetural

| Camada | Responsabilidade |
| :--- | :--- |
| **Interceptação** | Captura o momento exato da chegada da requisição. |
| **Delegacão** | Utiliza o padrão de eventos do Node.js para adiar a lógica de log. |
| **Cálculo** | Mensuração precisa da latência via diferença de timestamps. |
| **Orquestração** | `next()` garante que o pipeline de requisição não seja interrompido. |

**Conclusão**: Este é um componente de **infraestrutura invisível**. Ele é arquiteturalmente correto porque é **não-invasivo**: a lógica de negócio (seus controllers) não precisa saber que esse logger existe, mantendo o código limpo e seguindo o princípio de *Separation of Concerns* (Separação de Preocupações).