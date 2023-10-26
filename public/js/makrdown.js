document.addEventListener('DOMContentLoaded', function () {
    const markdownInput = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');

    markdownInput.addEventListener('input', function () {
        const markdownText = markdownInput.value;
        const htmlText = marked(markdownText); // 使用 marked 或其他 Markdown 转 HTML 的库
        preview.innerHTML = htmlText;
    });
});
