import LayoutBoard from './LayoutBoard';
import "./output.css";
export default {
    install(Vue, options) {
        Vue.component('LayoutBoard', LayoutBoard);
    }
}