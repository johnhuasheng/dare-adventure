/* ============================================================
   DARE 敢于未知 · 网页数据文件
   所有文字内容、视频和照片地址都在这里修改。
   媒体加载顺序：先找 assets/ 里的本地文件（运行「下载素材.bat」后才有），
   找不到就自动改用网上的地址（需要联网）。
   ============================================================ */
window.DARE={
  /* 首屏与揭示区素材 */
  media:{
    heroVideo:{local:'assets/videos/hero.mp4',remote:'https://videos.pexels.com/video-files/11246371/11246371-hd_1280_720_24fps.mp4',remoteMobile:'https://videos.pexels.com/video-files/11246371/11246371-hd_1280_720_24fps.mp4',start:0,end:1,rate:1,scrub:false},
    heroPoster:{local:'assets/images/hero.jpg',remote:'https://images.unsplash.com/photo-1563442162585-fa1426255ea9?auto=format&fit=crop&w=2000&q=75'},
    reveal:{local:'assets/images/reveal.jpg',remote:'https://images.unsplash.com/photo-1550992402-9b1fc58fd76d?auto=format&fit=crop&w=2000&q=75'}
  },

  /* 洞穴揭示区里藏着的 3 个发现点（x、y 是照片上的相对位置，0~1） */
  caveSpots:[
    {x:.76,y:.22,t:'钟乳石',d:'每年大约只长 0.1 毫米，头顶这一片要长上万年'},
    {x:.52,y:.74,t:'地下湖',d:'洞穴潜水员会从这样的水面潜入更深的水道'},
    {x:.13,y:.5,t:'溶洞',d:'流水溶蚀石灰岩，经过几十万年才掏空这里'}
  ],

  /* 五个冒险章节（按海拔从低到高）
     img = Unsplash 照片编号，vid = Pexels 视频文件路径，end = 只循环播放视频的前百分之多少 */
  chapters:[
 {id:'dive',localVid:'assets/videos/dive.mp4',localImg:'assets/images/dive.jpg',word:'DIVE',cn:'潜水',alt:-30,img:'1682687982167-d7fb3ed8541d',vid:'16430486/16430486-sd_960_540_30fps.mp4',end:.5,pos:'50% 50%',big:'−30M',bigLab:'Advanced open water · 进阶潜水员深度上限',
  title:'向下，也是一种出发',text:'水下的世界安静而缓慢。每往下 10 米，身上就多压一个大气压；你要学会的第一件事，是平稳地呼吸。',
  step:'报名一次体验潜水，在教练陪同下下潜，最深不超过 12 米。冲绳、三亚、涠洲岛都是好起点。',
  safe:'永远不要独自潜水，始终和潜伴一起行动。',time:'体验潜水半天；开放水域证书 3–4 天',
  facts:[['Pressure · 压力','30 米深处是 4 个大气压，同一瓶气消耗得比水面快得多。'],['Narcosis · 氮醉','30 米以下可能出现氮醉，判断力会像喝了酒一样下降。'],['Safety stop · 安全停留','上升要缓慢，并在 5 米深处停留 3 分钟。']]},
 {id:'climb',localVid:'assets/videos/climb.mp4',localImg:'assets/images/climb.jpg',word:'CLIMB',cn:'攀岩',alt:900,img:'1601224748193-d24f166b5c77',vid:'17270582/17270582-sd_960_540_30fps.mp4',end:1,pos:'50% 45%',big:'+900M',bigLab:'El Capitan · 酋长岩岩壁高度',
  title:'一次只解决一个动作',text:'岩壁不会一次问你所有问题。手点在哪、脚放哪、重心往哪移，一步一步，你就到了顶。2017 年，亚历克斯·霍诺德用不到 4 小时无保护攀完了酋长岩。',
  step:'去离你最近的室内攀岩馆，租一双鞋，从抱石区最简单的线路开始。',
  safe:'每次离地前，攀爬者和保护员互相检查绳结和锁扣。',time:'一节 1 小时的体验课',
  facts:[['Grade · 难度','新手从 5.9 左右起步；目前最难的线路是 9c。'],['Legs · 腿','攀岩主要靠腿和重心，脚法比臂力更重要。'],['Bouldering · 抱石','抱石墙一般不超过 4.5 米，下面铺着厚垫子。']]},
 {id:'glide',localVid:'assets/videos/glide.mp4',localImg:'assets/images/glide.jpg',word:'GLIDE',cn:'滑翔伞',alt:2500,img:'1578312055662-53316197d01e',vid:'2328903/2328903-hd_1280_720_25fps.mp4',end:1,pos:'50% 55%',big:'2,500M',bigLab:'Cloudbase · 晴好夏日常见云底',
  title:'借一股看不见的风',text:'滑翔伞没有发动机。飞行员寻找地面受热升起的热气流，在里面盘旋爬升，像鹰一样一路飞到云底，再滑向下一朵云。',
  step:'预约一次双人带飞，体验 10 到 20 分钟的飞行。想自己飞，再去正规俱乐部从地面操伞学起。',
  safe:'只在适飞天气起飞。风太大或有雷雨云时，留在地面也是勇气。',time:'双人带飞当天即可',
  facts:[['Thermal · 热气流','热气流的爬升率通常在每秒 1 到 5 米。'],['Wing · 伞翼','入门级 EN-A 伞翼的设计目标是遇到扰动时容易自行恢复。'],['Tandem · 带飞','教练在身后操控，你只需听口令跑几步。']]},
 {id:'skydive',localVid:'assets/videos/skydive.mp4',localImg:'assets/images/skydive.jpg',word:'JUMP',cn:'跳伞',alt:4000,img:'1521673252667-e05da380b252',vid:'7997334/7997334-hd_1280_720_30fps.mp4',end:1,pos:'50% 50%',big:'+4,000M',bigLab:'Exit altitude · 双人跳伞离机高度',
  title:'跨出舱门的那一步',text:'舱门打开，风灌进来。大约 60 秒的自由落体里，你以接近 200 km/h 的速度下落；伞花打开之后，世界一下子安静了。',
  step:'在有资质的跳伞中心预约一次双人跳伞。当天有 20 到 30 分钟的地面培训。',
  safe:'选择装备定期检修、教练持证的跳伞中心。',time:'一个下午',
  facts:[['Freefall · 自由落体','约 60 秒，下落速度接近 200 km/h。'],['Reserve · 备份伞','每套装备都有主伞和备份伞，很多还装有自动开伞装置。'],['Breathe · 呼吸','吸气 4 秒，屏息 4 秒，呼气 4 秒。心跳会慢下来。']]},
 {id:'alpine',localVid:'assets/videos/alpine.mp4',localImg:'assets/images/alpine.jpg',word:'SUMMIT',cn:'雪山',alt:8848.86,img:'1643903096045-07741be1f245',vid:'11417063/11417063-hd_1280_720_30fps.mp4',end:1,pos:'60% 40%',big:'8,848.86M',bigLab:'Everest · 2020 年中尼联合测定',
  title:'把目标拆成营地',text:'攀登雪山最需要耐心。队伍在营地之间反复上下，让身体适应稀薄的空气；峰顶的氧气大约只有海平面的三分之一。1960 年 5 月 25 日，中国登山队首次从北坡登顶珠峰。',
  step:'先从 3,000 到 4,000 米的高海拔徒步开始，再跟随有资质的向导团队，攀登哈巴雪山这样的入门雪山。',
  safe:'出发前定好折返时间，到点就下撤，不管离顶峰还有多近。',time:'数月的体能准备',
  facts:[['Death zone · 死亡地带','8,000 米以上，人体无法长期适应。'],['Starter peaks · 入门雪山','哈巴雪山 5,396 米，四姑娘山二峰 5,276 米。'],['Turnaround · 折返','设定折返时间，是雪山上最重要的规矩。']]}
],

  /* 页脚名言 */
  quotes:[
    ['"Because it\'s there."','因为山就在那里。 · 乔治·马洛里，1923'],
    ['"Life is either a daring adventure, or nothing."','人生要么是一场大胆的冒险，要么什么都不是。 · 海伦·凯勒'],
    ['"It is not the mountain we conquer, but ourselves."','我们征服的不是高山，而是我们自己。 · 埃德蒙·希拉里']
  ],

  /* 滚动字幕条 */
  marquee:['DIVE','<i>into</i>','CLIMB','<i>beyond</i>','GLIDE','<i>above</i>','JUMP','<i>through</i>','SUMMIT','<i>higher</i>']
};
