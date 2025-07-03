const { Title, Description, Rectangle } = require('./UiKit');

function Comment(text) {
  return `<span class="console_comment">// ${text}</span>`;
}

function Command(text) {
  return `<span class="console_command">${text}</span>`;
}

module.exports = function(t) {
  return `
    ${Rectangle('top_left')}
    <section class="console_section">
      ${Title(t("console.title"))}
      ${Description(t("console.description"))}
      <div class="console">
        <div class="console_header">
          <span class="console_header_icon"></span>
          <span class="console_header_icon"></span>
          <span class="console_header_icon"></span>
        </div>
        <div class="console_body">
          ${Comment("NodeJS")}
          ${Command("npx assayo")}
          ${Comment("Python")}
          ${Command("pipx install assayo")}
          ${Comment("Ruby")}
          ${Command("gem install assayo")}
          ${Comment("Go")}
          ${Command("go get github.com/bakhirev/assayo")}
          ${Command("go install github.com/bakhirev/assayo")}
          ${Comment("PHP")}
          ${Command("composer require bakhirev/assayo")}
          ${Comment("Docker")}
          ${Command("docker pull bakhirev/assayo")}
        </div>
      </div>
    </section>
    ${Rectangle('bottom_right')}
`;
}
