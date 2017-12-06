/**
 * Created by tianwu on 2017/3/22.
 */
import Store from './store';
import connect from './connect';
import Provider from './provider';

Store.connect= connect;
Store.Provider= Provider;
export default Store;