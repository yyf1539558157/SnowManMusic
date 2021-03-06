import * as types from "./mutation-types"
import {playMode} from "../common/js/config"
import {shuffle} from "../common/js/utils"
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from "../common/js/cache"

//找索引
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  })
}

//选择播放模式
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);
  //随机播放
  if (state.mode === playMode.random) {
    //随机播放列表
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
//随机播放
export const radomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
//插入歌曲到播放列表
export const insertSong = function ({commit, state}, song) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  //修改playList
  //记录下当前歌曲
  let currentSong = playList[currentIndex];
  //查找当前列表中是否有待插入的歌曲再返回索引
  let fpIndex = findIndex(playList, song);
  //插入歌曲，索引加一
  currentIndex++;
  //插入这歌到当前位置
  playList.splice(currentIndex, 0, song);
  //如果包含了这首歌就删除
  if (fpIndex > -1) {
    //如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1);
      currentIndex--;
    } else {
      //如果在前面
      playList.splice(fpIndex + 1, 1);
    }
  }
  //修改sequenceList
  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  let fsIndex = findIndex(sequenceList, song);
  sequenceList.splice(currentSIndex, 0, song);
  if (fsIndex > -1) {
    //如果当前插入的序号大于列表中的序号
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      //如果在前面
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  //提交
  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
export const deleteSong = function ({commit, state}, song) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let pIndex = findIndex(playList, song);
  playList.splice(pIndex, 1);
  let sIndex = findIndex(sequenceList, song);
  sequenceList.splice(sIndex, 1);
  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--;
  }
  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  const playingState = playList.length > 0;
  commit(types.SET_PLAYING_STATE, playingState);
};
export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
};
//保存播放记录

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
};
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
};
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
};
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
};
export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
};
export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))

};
