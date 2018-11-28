<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.bn{
  position: absolute;
  z-index: 10;
  top: -18px;
  right: -18px;
  width: 40px;
  height: 40px;
  padding: 10px;
  cursor: pointer;
}
.thumbnail-img {
		position: absolute;
		top: 50%;
		left: 50%;
		display: block;
		width: 100%;
		height: 100%;
		transform: translate3d(-50%, -50%, 0);
		background: #FFF;
		object-fit: cover;
		object-position: center;
}
.lt-flexbox {
		display : -webkit-box;
		display : -ms-flexbox;
		display : -webkit-flex;
		display :         flex;
		&.flex-wrap {
					-ms-flex-wrap : wrap;
			-webkit-flex-wrap : wrap;
							flex-wrap : wrap;
			-webkit-box-lines : multiple;
		}

		&.flex-column {
					-ms-flex-direction : column;
							flex-direction : column;

			-webkit-flex-direction : column;
				-moz-box-orient : vertical;
			-webkit-box-orient : vertical;
				-moz-box-direction : normal;
			-webkit-box-direction : normal;
		}
		&.flex-end {
			-webkit-justify-content : flex-end;
							justify-content : flex-end;
			-ms-flex-pack : end;
				-moz-box-pack : end;
			-webkit-box-pack : end;
		}
		&.justify {
			-webkit-box-pack : justify;
				-moz-box-pack : justify;
			-ms-flex-pack : justify;
			-webkit-justify-content : space-between;
							justify-content : space-between;
		}
		&.vertical {
			-webkit-box-align : center;
			-ms-flex-align : center;
			-webkit-align-items : center;
							align-items : center;
		}
		&.horizontal {
			-webkit-box-pack : center;
			-ms-flex-pack : center;
			-webkit-justify-content : center;
							justify-content : center;
		}
		.inner-ft {
			-webkit-transition : width .2s;
							transition : width .2s;

			-webkit-box-ordinal-group : 1;
			/* OLD - iOS 6-, Safari 3.1-6 */
			/* OLD - Firefox 19- */
			-ms-flex-order : 1;
			/* TWEENER - IE 10 */
			-webkit-order : 1;
			/* NEW - Chrome */
							order : 1;
			/* NEW, Spec - Opera 12.1, Firefox 20+ */
		}
		.inner-ht {
			-webkit-transition : width .2s;
							transition : width .2s;

			-webkit-box-ordinal-group : 30;
			/* OLD - iOS 6-, Safari 3.1-6 */
			/* OLD - Firefox 19- */
			-ms-flex-order : 30;
			/* TWEENER - IE 10 */
			-webkit-order : 30;
			/* NEW - Chrome */
							order : 30;
			/* NEW, Spec - Opera 12.1, Firefox 20+ */
		}
		.inner-content {
			min-width : 0;
			min-height : 0;

			-webkit-transition : width .2s;
							transition : width .2s;
			/* NEW, Spec - Opera 12.1, Firefox 20+ */

							flex : 1;
			-webkit-box-ordinal-group : 10;
			/* OLD - iOS 6-, Safari 3.1-6 */
			/* OLD - Firefox 19- */
			-ms-flex-order : 10;
			/* TWEENER - IE 10 */
			-webkit-order : 10;
			/* NEW - Chrome */
							order : 10;
			-webkit-box-flex : 1;
			-webkit-flex : 1;
				-moz-box-flex : 1;
					-ms-flex : 1;
		}
}

</style>
