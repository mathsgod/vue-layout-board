<template>
	<div class="layout-board" :class="{
		'relative flex h-full min-h-full w-full flex-col':
			scalable && !autoHeight,
		'relative flex w-full flex-col': scalable && autoHeight,
		'items-center': (align == 'center' || autoHeight) && scalable,
		'items-start': align == 'left' && scalable && !autoHeight,
		'items-end': align == 'right' && scalable && !autoHeight,
		'justify-center': valign == 'center' && scalable && !autoHeight,
		'justify-start': (valign == 'top' || autoHeight) && scalable,
		'justify-end': valign == 'bottom' && scalable && !autoHeight,
		'overflow-hidden': overflowHidden && scalable,
	}" :style="
	size != 'cover' && size != 'fit-height' && scalable && !autoHeight
		? `min-height: ${height * scale}px; --layoutheight: ${
				height * scale
		  }px;`
		: scalable && autoHeight
		? `min-height: ${contentHeight}px; height: ${contentHeight}px; --layoutheight: ${contentHeight}px;`
		: ``
">
		<div class="inner-board" :class="{ relative: scalable }" :style="
			scalable && !autoHeight
				? `width: ${width}px; min-width: ${width}px; height: ${height}px; min-height: ${height}px;transform: scale(${scale});transform-origin: ${align} ${valign};`
				: scalable && autoHeight
		? `width: ${width}px; min-width: ${width}px;transform: scale(${scale});transform-origin: center top;`
		: ``
		">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		width: {
			type: Number,
			default: 1920,
		},
		height: {
			type: Number,
			default: 1080,
		},
		size: {
			type: String,
			default: "contain",
		},
		align: {
			type: String,
			default: "center",
		},
		valign: {
			type: String,
			default: "center",
		},
		scalable: {
			type: Boolean,
			default: true,
		},
		maxScale: {
			type: Number,
			default: 0,
		},
		overflowHidden: {
			type: Boolean,
			default: true,
		},
		autoHeight: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			scale: 1,
			contentHeight: 0,
		};
	},
	watch: {
		size(value) {
			this.handleResize();
		},
		scale(value) {
			this.$emit("resize", value);
		},
	},
	created() { },
	mounted() {
		window.addEventListener("resize", this.handleResize);
		this.handleResize();

		setTimeout(() => {
			this.handleResize();
		}, 100);
	},
	destroyed() {
		window.removeEventListener("resize", this.handleResize);
	},
	methods: {
		handleResize() {
			if (!this.scalable) {
				this.scale = 1;
				return;
			}

			let boardScale =
				this.$el.parentNode.clientWidth /
				this.$el.parentNode.clientHeight;

			if (this.autoHeight) {
				this.scale = this.$el.parentNode.clientWidth / this.width;

				if (this.maxScale > 0 && this.scale > this.maxScale) {
					this.scale = this.maxScale;
				}

				this.contentHeight =
					this.$el.querySelector(".inner-board").clientHeight *
					this.scale;
			} else {
				switch (this.size) {
					case "contain":
						if (boardScale < this.width / this.height) {
							this.scale =
								this.$el.parentNode.clientWidth / this.width;
						} else {
							this.scale =
								this.$el.parentNode.clientHeight / this.height;
						}
						break;
					case "cover":
						if (boardScale > this.width / this.height) {
							this.scale =
								this.$el.parentNode.clientWidth / this.width;
						} else {
							this.scale =
								this.$el.parentNode.clientHeight / this.height;
						}
						break;
					case "fitWidth":
						this.scale =
							this.$el.parentNode.clientWidth / this.width;
						break;
					case "fitHeight":
						this.scale =
							this.$el.parentNode.clientHeight / this.height;
						break;
					default:
						if (boardScale < this.width / this.height) {
							this.scale =
								this.$el.parentNode.clientWidth / this.width;
						} else {
							this.scale =
								this.$el.parentNode.clientHeight / this.height;
						}
						break;
				}
				if (this.maxScale > 0 && this.scale > this.maxScale) {
					this.scale = this.maxScale;
				}
				setTimeout(() => {
					if (
						boardScale ==
						this.$el.parentNode.clientWidth /
						this.$el.parentNode.clientHeight
					)
						return;
					this.handleResize();
				}, 100);
			}
			/*
			this.$nextTick(() => {
				console.log("layout board height", this.$el.clientHeight);
				console.log(
					"inner board height",
					this.$el.querySelector(".inner-board").clientHeight
				);
			});
			*/
		},
	},
};
</script>
