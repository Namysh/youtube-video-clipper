<script setup>
import { reactive, ref } from "vue";
import { isYoutubeVideo } from "@/utils";
import { useApi } from "@/useApi";

const form = reactive({ url: "", start_time: '00:00:00', end_time: '00:00:10' });

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  form.url = tabs[0]?.url;
});

const { downloadClip, cutVideo, isLoading, data } = useApi();
</script>

<template>
  <div
    class="p-4 bg-white rounded-xl flex flex-col w-[350px] gap-4 overflow-hidden"
  >
    <span class="font-bold text-lg mx-auto">Youtube video clipper</span>
    <template v-if="isYoutubeVideo(form.url)">
      <div class="flex flex-col gap-1">
        <span class="text-sm">Url</span>
        <span
          class="bg-black/20 cursor-disabled cursor-not-allowed flex-grow rounded-md outline-none border-none p-1"
          >{{ form.url }}</span
        >
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-sm">Start time - end time (hh:mm:ss)</span>
        <div class="flex gap-1 items-center">
          <input
            v-model="form.start_time"
            type="time"
            step="1"
            min="0"
            class="bg-black/20 flex-grow rounded-md outline-none border-none p-1"
          />
          -
          <input
            v-model="form.end_time"
            type="time"
            step="1"
            :min="form.start_time"
            class="bg-black/20 flex-grow rounded-md outline-none border-none p-1"
          />
        </div>
      </div>

      <button
        @click="!isLoading && (data ? downloadClip() : cutVideo(form))"
        class="rounded-md px-4 leading-4 py-2 inline-flex items-center justify-center bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer w-full"
      >
        <svg
          v-if="isLoading"
          class="animate-spin size-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span v-else-if="data">Download clip</span>
        <span v-else>🪄 Clip video</span>
      </button>
      <span class="text-orange-500 text-sm text-center mx-auto" v-if="isLoading"
        >This may take a few minutes</span
      >
      <span
        class="text-green-500 text-sm mx-auto text-center"
        v-else-if="data"
        >Your clip is ready to be downloaded !</span
      >
    </template>
    <template v-else>
      <span class="mx-auto">You must be on a youtube video</span>
    </template>
  </div>
</template>

<style></style>
