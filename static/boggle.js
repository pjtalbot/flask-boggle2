class BoggleGame {
	constructor(boardId, secs = 60) {
		this.secs = secs;
		this.words = new Set();
		this.board = $('#' + boardId);
		this.score = 0;
		this.showScore();
		this.showTimer();
		$('.reset', this.board).hide();

		this.timer = setInterval(this.tick.bind(this), 1000);

		$('.add-word', this.board).on('submit', this.handleSubmit.bind(this));
	}

	showScore() {
		$('.score', this.board).text(`Score: ${this.score}`);
	}

	showWord(word) {
		console.log('Showing word');
		$('.words', this.board).append($('<li>', { text: word }));
	}

	showMessage(msg) {
		$('.msg', this.board).text(msg);
	}

	showTimer() {
		$('.timer', this.baord).text(this.secs);
	}

	async tick() {
		if (this.secs > 0) {
			this.secs = this.secs - 1;
			this.showTimer();
		} else {
			clearInterval(this.timer);
			await this.scoreGame();
		}
	}

	async scoreGame() {
		console.log('scoreing game');
		console.log(this.score);
		$('.add-word', this.board).hide();
		$('.timer', this.board).text(`Round Complete`);
		$('.reset', this.board).show();
		$('.reset', this.board).click((e) => {
			location.reload();
		});
		const res = await axios.post('post-score', { score: this.score });
		if (res.data.brokeRecord) {
			this.showMessage(`NEW RECORD: ${this.score}`, '200');
		} else {
			this.showMessage(`Final Score: ${this.score}`);
		}
	}

	async handleSubmit(e) {
		e.preventDefault();
		// jQuery retreives "word" from form via class "word" templates/index.html
		const $word = $('.word', this.board);

		let word = $word.val();
		if (!word) return;

		if (this.words.has(word)) {
			this.showMessage(`Already found ${word}`);
			$word.val('').focus();
			this.score += word.length;
			return;
		}

		// checking "server" (words.txt) for word

		const res = await axios.get('/check-word', { params: { word: word } });
		if (res.data.result === 'not-word') {
			this.showMessage(`Not a valid word`);
		} else if (res.data.result === "not-on'board") {
			this.showMessage(`Not on this Board`);
		} else {
			console.log('Correct word');
			this.showWord(word);
			this.score += word.length;
			this.showScore();
			this.words.add(word);
			this.showMessage('');
		}

		$word.val('').focus();
	}
}
