<script>
import api from '@/services/api';
import {
  Chart,
  LineController,
  BarController,
  PieController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

Chart.register(
  LineController, BarController, PieController, DoughnutController,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Title, Tooltip, Legend, Filler
);

export default {
  name: 'AdminDashboard',
  data() {
    return {
      loading: true,
      stats: {
        totalUsers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalChats: 0
      },
      recentUsers: [],
      recentPosts: [],
      chartData: {
        userLabels: [],
        userData: [],
        postData: [],
        chatData: [],
        chatLabels: [],
      },
    };
  },
  // ✅ FIX: Removed mounted() timeout. We will init charts after data fetch.
  
  methods: {
    async totalCount() {
      try {
        let res = await api.get('/total-summary');

        // 1. Set Stats
        this.stats.totalUsers = res.data.stats.totalUsers; // Check structure
        this.stats.totalChats = res.data.stats.totalChats;
        this.stats.totalComments = res.data.stats.totalComments;
        this.stats.totalPosts = res.data.stats.totalPosts;

        // 2. Set Tables
        this.recentUsers = res.data.usersWithCounts; // Ensure backend sends 'recentUsers'
        this.recentPosts = res.data.postsWithAuthor; // Ensure backend sends 'recentPosts'

        // 3. Process Charts
        // ✅ FIX: Use correct key names (removed 'Raw')
        if (res.data.userGrowthRaw) {
          this.processUserGrowth(res.data.userGrowthRaw, this.stats.totalUsers);
        }
        if (res.data.postActivityRaw) {
          this.processPostActivity(res.data.postActivityRaw);
        }
        if (res.data.chatGrowthRaw) {
          this.processChatGrowth(res.data.chatGrowthRaw);
        }

        // ✅ FIX: Initialize charts only AFTER data is processed
        this.loading = false;
        this.$nextTick(() => {
          this.initCharts();
        });

      } catch (e) {
        console.log("Error fetching data:", e);
        this.loading = false; // Stop loading even if error
      }
    },

    processUserGrowth(backendData, currentTotalUsers) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let dataMap = {};
      
      backendData.forEach(item => {
        // Handle if mongo returns numeric ID or object
        const m = item._id.month || 0;
        const y = item._id.year || 0;
        const key = `${y}-${m - 1}`;
        dataMap[key] = item.count;
      });

      let labels = [];
      let dataPoints = [];
      let runningTotal = currentTotalUsers;
      const today = new Date();

      for (let i = 0; i < 6; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = d.getFullYear();
        const monthIdx = d.getMonth();
        const key = `${year}-${monthIdx}`;

        labels.unshift(monthNames[monthIdx]);
        dataPoints.unshift(runningTotal);

        const joinedThisMonth = dataMap[key] || 0;
        runningTotal -= joinedThisMonth;
      }

      this.chartData.userLabels = labels;
      this.chartData.userData = dataPoints;
    },

    processPostActivity(data) {
      let weeklyCounts = [0, 0, 0, 0, 0, 0, 0];
      if (Array.isArray(data)) {
        data.forEach(item => {
          const mongoDay = item._id; 
          // Mongo: 1=Sun ... 7=Sat
          // Map to: 0=Mon ... 6=Sun
          let index = (mongoDay + 5) % 7;
          weeklyCounts[index] = item.count;
        });
      }
      this.chartData.postData = weeklyCounts;
    },

    processChatGrowth(backendData) {
      let dataMap = {};
      if (Array.isArray(backendData)) {
        backendData.forEach(item => {
          // Key format: "M-D"
          const key = `${item._id.month}-${item._id.day}`;
          dataMap[key] = item.count;
        });
      }

      let labels = [];
      let values = [];
      const today = new Date();

      // Loop BACKWARDS 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);

        const month = d.getMonth() + 1; 
        const day = d.getDate();
        const key = `${month}-${day}`;

        labels.push(day); // Label is just the day number (e.g., 15)
        values.push(dataMap[key] || 0);
      }

      this.chartData.chatLabels = labels;
      this.chartData.chatData = values;
      console.log(labels)
      console.log(values)
    },

    viewProfile(id) {
      console.log("View profile", id);
    },
    viewPost(id) {
      console.log("View Post", id);
    },
    
    initCharts() {
      // Destroy existing charts if they exist (prevents canvas reuse errors)
      // Note: In simple Vue components, re-creating usually works if container is re-rendered,
      // but checking refs is safer.

      const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(51, 34, 28, 0.9)',
            titleColor: '#ffdeb3',
            bodyColor: '#ffb78e',
            borderColor: '#ffb78e',
            borderWidth: 1
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255, 222, 179, 0.05)' },
            ticks: { color: '#ffb78e' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#ffb78e' }
          }
        }
      };

      // 1. USER GROWTH
      if (this.$refs.userChart) {
        new Chart(this.$refs.userChart, {
          type: 'line',
          data: {
            labels: this.chartData.userLabels,
            datasets: [{
              label: 'Total Users',
              data: this.chartData.userData,
              borderColor: '#ffdeb3',
              backgroundColor: (ctx) => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(255, 222, 179, 0.4)');
                gradient.addColorStop(1, 'rgba(255, 222, 179, 0)');
                return gradient;
              },
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: '#33221c'
            }]
          },
          options: commonOptions
        });
      }

      // 2. POST GROWTH
      if (this.$refs.postChart) {
        new Chart(this.$refs.postChart, {
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Posts',
              data: this.chartData.postData,
              backgroundColor: '#ffb78e',
              borderRadius: 6,
              barThickness: 15
            }]
          },
          options: commonOptions
        });
      }

      // 3. CHAT GROWTH (Daily)
      if (this.$refs.chatChart) {
        new Chart(this.$refs.chatChart, {
          type: 'line',
          data: {
            labels: this.chartData.chatLabels,
            datasets: [{
              label: 'New Chats',
              data: this.chartData.chatData,
              borderColor: '#ff6b6b',
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              stepped: true,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 6,
              fill: true
            }]
          },
          options: {
            ...commonOptions,
            scales: {
              x: {
                display: true,
                grid: { display: false },
                ticks: {
                  color: '#ffb78e',
                  maxTicksLimit: 30
                }
              },
              y: {
                display: true,
                grid: { display: true },
                ticks: {
                  color: '#ffb78e',
                  maxTicksLimit: 30
                }
              }
            }
          }
        });
      }

      // 4. COMMENT INCREASE
      // if (this.$refs.commentChart) {
      //   new Chart(this.$refs.commentChart, {
      //     type: 'bar',
      //     data: {
      //       labels: ['Posts', 'Reels', 'Stories'], // Simplified labels
      //       datasets: [{
      //         label: 'Comments',
      //         data: [this.stats.totalComments, 0, 0], // Using total for now
      //         backgroundColor: '#5c3a2a',
      //         borderRadius: 4,
      //         barPercentage: 0.6
      //       }]
      //     },
      //     options: {
      //       ...commonOptions,
      //       indexAxis: 'y',
      //     }
      //   });
      // }
    }
  },
  async created() {
    await this.totalCount();
  }
};
</script>

<template>
  <div class="admin-container">
    
    <header class="header">
      <div class="title-block">
        <h1>Admin Dashboard</h1>
        <p>System Overview & Analytics</p>
      </div>
      <div class="admin-profile">
        <span>Super Admin</span>
        <div class="avatar-circle">A</div>
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Brewing data...</p>
    </div>

    <div v-else class="content-grid">
      
      <section class="stats-row">
        <div class="stat-card">
          <div class="stat-icon user-bg"><i class="bi bi-people-fill"></i></div>
          <div class="stat-info">
            <h3>{{ stats.totalUsers }}</h3>
            <span>Total Users</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon post-bg"><i class="bi bi-grid-fill"></i></div>
          <div class="stat-info">
            <h3>{{ stats.totalPosts }}</h3>
            <span>Total Posts</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon comment-bg"><i class="bi bi-chat-left-text-fill"></i></div>
          <div class="stat-info">
            <h3>{{ stats.totalComments }}</h3>
            <span>Comments</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon chat-bg"><i class="bi bi-send-fill"></i></div>
          <div class="stat-info">
            <h3>{{ stats.totalChats }}</h3>
            <span>Chats</span>
          </div>
        </div>
      </section>

      <section class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h4>User Growth</h4>
            <span class="tag line">Curve</span>
          </div>
          <div class="canvas-wrapper">
            <canvas ref="userChart"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-header">
            <h4>Post Volume</h4>
            <span class="tag bar">Daily</span>
          </div>
          <div class="canvas-wrapper">
            <canvas ref="postChart"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-header">
            <h4>Chat Growth</h4>
            <span class="tag step">Stepped</span>
          </div>
          <div class="canvas-wrapper">
            <canvas ref="chatChart"></canvas>
          </div>
        </div>
        <!-- <div class="chart-card">
          <div class="chart-header">
            <h4>Comment Increase</h4>
            <span class="tag horiz">Horizontal</span>
          </div>
          <div class="canvas-wrapper">
            <canvas ref="commentChart"></canvas>
          </div>
        </div> -->
      </section>

      <section class="tables-grid">
        
        <div class="table-card">
          <div class="card-header">
            <h4>All Users</h4>
          </div>
          
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Activity Stats</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in recentUsers" :key="user._id">
                  <td>
                    <div class="user-profile-cell">
                      <img :src="user.avatar" class="table-avatar" />
                      <div class="txt">
                        <p class="name">{{ user.name }}</p>
                        <small class="username">@{{ user.username }}</small>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div class="user-stats-enhanced">
                      <div class="stat-item">
                        <span class="lbl">Posts</span>
                        <span class="val">{{ user.posts }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="lbl">Followers</span>
                        <span class="val">{{ user.followers.length }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="lbl">Following</span>
                        <span class="val">{{ user.following.length }}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span class="badge" :class="user.status.toLowerCase()">{{ user.status }}</span>
                  </td>

                  <td>
                    <button class="action-btn" @click="viewProfile(user._id)">
                      View Profile
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="table-card">
          <div class="card-header">
            <h4>All Posts</h4>
          </div>
          
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Preview</th> 
                  <th>Likes</th>
                  <th>Comments</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in recentPosts" :key="post._id">
                  <td class="highlight-text">{{ post.author }}</td>
                  
                  <td>
                    <img :src="post.image.url" class="post-thumb" alt="Post">
                  </td>

                  <td>
                    <div class="likes-cell">
                      <i class="bi bi-heart-fill"></i> {{ post.likes }}
                    </div>
                  </td>
                  <td class="highlight-text">{{ post.commentsCount }}</td>
                  
                  <td>
                    <button class="action-btn outline" @click="viewPost(post._id)">
                      View Post
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </section>

    </div>
  </div>
</template>

<style scoped>
/* --- LAYOUT --- */
.admin-container {
  min-height: 100vh;
  background-color: rgb(32, 17, 6);
  color: rgb(255, 222, 179);
  padding: 1.5rem;
  padding-bottom: 80px;
  font-family: 'Lexend', sans-serif;
}

/* --- HEADER --- */
.header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 222, 179, 0.1); padding-bottom: 1rem;
}
.title-block h1 { margin: 0; font-size: 1.8rem; font-weight: 700; }
.title-block p { margin: 0; color: #ffb78e; font-size: 0.9rem; }
.admin-profile { display: flex; align-items: center; gap: 10px; }
.avatar-circle { width: 40px; height: 40px; background: #ffb78e; color: rgb(32, 17, 6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }

/* --- STATS GRID --- */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card { background: rgb(51, 34, 28); padding: 1.2rem; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); }
.stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; }

.user-bg { background: rgba(255, 222, 179, 0.2); color: #ffdeb3; }
.post-bg { background: rgba(255, 183, 142, 0.2); color: #ffb78e; }
.comment-bg { background: rgba(92, 58, 42, 0.4); color: #eecfa1; }
.chat-bg { background: rgba(255, 107, 107, 0.15); color: #ff6b6b; }

.stat-info h3 { margin: 0; font-size: 1.6rem; font-weight: 700; }
.stat-info span { font-size: 0.85rem; color: #ffb78e; opacity: 0.8; }

/* 🔥 RESPONSIVE FIX FOR MOBILE (2 Columns) */
@media (max-width: 600px) {
  .stats-row { grid-template-columns: 1fr 1fr; gap: 0.6rem; }
  .stat-card { padding: 0.8rem 0.6rem; gap: 0.6rem; flex-direction: column; text-align: center; }
  .stat-icon { width: 40px; height: 40px; font-size: 1.2rem; }
  .stat-info h3 { font-size: 1.4rem; }
  .stat-info span { font-size: 0.75rem; }
}

/* --- CHARTS GRID --- */
.charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px,1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.chart-card { background: rgb(51, 34, 28); padding: 1.2rem; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); height: 320px; display: flex; flex-direction: column; min-width: 0; }
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.chart-header h4 { margin: 0; font-size: 1rem; color: #ffdeb3; }
.tag { font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: 600; text-transform: uppercase;}
.tag.line { background: rgba(255, 222, 179, 0.2); color: #ffdeb3; }
.tag.bar { background: rgba(255, 183, 142, 0.2); color: #ffb78e; }
.tag.step { background: rgba(255, 107, 107, 0.2); color: #ff6b6b; }
.tag.horiz { background: rgba(92, 58, 42, 0.5); color: #eecfa1; }
.canvas-wrapper { flex: 1; position: relative; width: 100%; height: 100%; overflow: hidden; }

/* --- TABLES GRID --- */
.tables-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); gap: 1.5rem; }

.table-card {
  background: rgb(51, 34, 28);
  padding: 1.2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  height: 600px; 
  min-width: 0;
}

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.card-header h4 { margin: 0; font-size: 1.2rem; font-weight: 600; }

/* TABLE CONTAINER (Scrolling) */
.table-container {
  flex: 1;
  overflow-y: auto; 
  overflow-x: auto; 
  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
}

table { width: 100%; border-collapse: collapse; min-width: 500px; }

/* STICKY HEADER */
thead th {
  position: sticky; top: 0; background-color: rgb(51, 34, 28); z-index: 2;
  text-align: left; font-size: 0.75rem; text-transform: uppercase; color: #ffb78e;
  padding: 1rem 0.5rem; border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

tbody td {
  padding: 1rem 0.5rem; font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03); vertical-align: middle;
}

tr:last-child td { border-bottom: none; }

/* User Details */
.user-profile-cell { display: flex; align-items: center; gap: 12px; }
.table-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #ffb78e; }
.user-profile-cell .name { margin: 0; font-weight: 600; font-size: 0.95rem; }
.user-profile-cell .username { font-size: 0.8rem; color: #ffb78e; opacity: 0.7; }

/* ENHANCED User Stats */
.user-stats-enhanced { display: flex; gap: 15px; }
.stat-item { display: flex; flex-direction: column; }
.stat-item .lbl { font-size: 0.65rem; color: #ffb78e; opacity: 0.7; text-transform: uppercase; }
.stat-item .val { font-size: 0.9rem; font-weight: 700; color: #ffdeb3; }

/* Post Thumb */
.post-thumb {
  width: 50px; height: 50px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);
}

/* Post Content */
.highlight-text { color: #ffb78e; font-weight: 500; }
.likes-cell { color: #ff6b6b; font-size: 0.9rem; font-weight: 600; }

/* Actions */
.action-btn { background: #ffb78e; color: rgb(32, 17, 6); border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: transform 0.1s; }
.action-btn.outline { background: transparent; border: 1px solid #ffb78e; color: #ffb78e; }
.action-btn:hover { transform: scale(1.05); }

/* Badges */
.badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
.badge.active { background: rgba(76, 209, 55, 0.2); color: #4cd137; }
.badge.banned { background: rgba(255, 107, 107, 0.2); color: #ff6b6b; }
.badge.inactive { background: rgba(128, 128, 128, 0.2); color: #aaa; }

/* Loading */
.loading-state { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ffb78e; }
.spinner { width: 40px; height: 40px; border: 4px solid rgba(255, 183, 142, 0.3); border-top-color: #ffb78e; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }

/* RESPONSIVE */
@media (max-width: 768px) {
  .charts-grid, .tables-grid { grid-template-columns: 1fr; }
  .user-stats-enhanced { gap: 8px; } 
  .stat-item .lbl { font-size: 0.6rem; }
}
</style>