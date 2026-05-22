kubectl get pods
apt install kubectl
sudo apt update && sudo apt upgrade -y
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt update
sudo apt install -y kubectl
kubectl get pods
sudo apt update
sudo apt install unzip curl -y
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
cat /etc/resolv.conf
vi /etc/resolv.conf
vi /etc/wsl.conf
sudo rm -f /etc/resolv.conf
sudo nano /etc/resolv.conf
sudo chattr +i /etc/resolv.conf
ls
apt update
aws eks update-kubeconfig
aws s3 ls
aws ec2 describe-instances
kubectl auth via aws eks token
sudo apt update
sudo apt install unzip curl -y
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version
aws configure
kubectl get nodes
aws eks update-kubeconfig --region ap-south-2 --name paybridge24-eks
kubectl get nodes
kubectl get pods
kubectl get ing
kubectl get ingress -A
kubectl get ingress demo-app-ingress -n default -o yaml > ingress-current.yaml
vi ingress-current.yaml
cat ingress-current.yaml 
kubectl annotate ingress demo-app-ingress -n default alb.ingress.kubernetes.io/certificate-arn='arn:aws:acm:ap-south-2:524954473372:certificate/16355201-e532-4027-9ea6-67f414840ada' alb.ingress.kubernetes.io/listen-ports='[{"HTTP":80},{"HTTPS":443}]' alb.ingress.kubernetes.io/ssl-redirect='443' --overwrite
kubectl describe ingress demo-app-ingress -n default
kubectl get ingress -n default
sudo apt update
sudo apt install redis-tools -y
nc -zv master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com:6379 6379
nc -zv master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com:6379 
nc -zv master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com 6379 
redis-cli master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com 6379
redis-cli master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com -p 6379
redis-cli -h master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com -p 6379 --tls
nc -zv master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com 6379
nc -zvw5 master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com 6379
redis-cli -h master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com -p 6379
nc -zvw5 master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com 6379
redis-cli -h master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com -p 6379
nc -zvw5 master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com 6379
redis-cli -h master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com -p 6379
redis-cli -h master.paybridge24-redis.yqnwyw.aps2.cache.amazonaws.com -p 6379 --tls
sudo apt update
sudo apt install postgresql-client -y
nc -zvw5 paybridge24-postgres.cfygmwmaeert.ap-south-2.rds.amazonaws.com 5432
psql -h paybridge24-postgres.cfygmwmaeert.ap-south-2.rds.amazonaws.com -p 5432 -U paybridgeadmin
psql -h paybridge24-postgres.cfygmwmaeert.ap-south-2.rds.amazonaws.com -p 5432 -U paybridgeadmin -d postgres
kubectl create namespace logging
helm repo add fluent https://fluent.github.io/helm-charts
helm repo update
apt install helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm repo add fluent https://fluent.github.io/helm-charts
helm repo update
ls
helm pull fluent/fluent-bit --untar
ls
cd fluent-bit/
ls
vi values.yaml 
cat values.yaml 
vi values.yaml 
mv values.yaml /opt/
cp /opt/values.yaml .
vi values.yaml 
helm install fluent-bit . -n logging
kubectl get pods -n logging
kubectl logs -n logging -l app.kubernetes.io/name=fluent-bit
curl -k -u paybridge24-ps:KOsQ@2267kFY https://vpc-paybridge24-logs-b5vys6bxqgnif6r6prbg6fqhkm.ap-south-2.es.amazonaws.com
vi values.yaml 
helm upgrade fluent-bit . -n logging
kubectl logs -n logging -l app.kubernetes.io/name=fluent-bit --tail=100
kubectl run curltest -n logging --image=curlimages/curl:latest --rm -it -- sh
kubectl rollout restart daemonset fluent-bit -n logging
kubectl logs -n logging -l app.kubernetes.io/name=fluent-bit --tail=100
vi values.yaml 
kubectl get configmap fluent-bit -n logging -o yaml
vi values.yaml 
cat values.yaml 
vi values.yaml 
helm upgrade fluent-bit . -n logging
kubectl rollout restart daemonset fluent-bit -n logging
kubectl logs -n logging -l app.kubernetes.io/name=fluent-bit --tail=200
vi values.yaml 
helm upgrade fluent-bit . -n logging
kubectl rollout restart daemonset fluent-bit -n logging
kubectl logs -n logging -l app.kubernetes.io/name=fluent-bit --tail=100
vi values.yaml 
helm upgrade fluent-bit . -n logging
kubectl rollout restart daemonset fluent-bit -n logging
kubectl logs -n logging -l app.kubernetes.io/name=fluent-bit --tail=100
ls
kubectl get pods 
ssh -f -N -L 3000:0.0.0.0:3000 ssh s_01ks4z879n5d5nmq2amw4z6jd3@ssh.lightning.ai
ssh -f -N -L 3000:0.0.0.0:3000 s_01ks4z879n5d5nmq2amw4z6jd3@ssh.lightning.ai
netstat -tnlp
ssh -f -N -L 11434:0.0.0.0:11434 s_01ks4z879n5d5nmq2amw4z6jd3@ssh.lightning.ai
apt install net-tools
netstat -tnlp
http://localhost:11434/api/tags
curl http://localhost:11434/api/tags
netstat -tnlp
ssh -f -N -L 11434:[::1]:11434 s_01ks4z879n5d5nmq2amw4z6jd3@ssh.lightning.ai
netstat -tnlp
curl http://localhost:11434/api/tags
curl http://127.0.0.1:11434/api/tags
curl http://127.0.0.1:11500/api/tags
curl http://localhost:11434/api/tags
netstat -tnlp
curl http://localhost:11434/api/tags
ssh -f -N -L 11434:[::1]:11434 s_01ks4z879n5d5nmq2amw4z6jd3@ssh.lightning.ai
curl http://localhost:11434/api/tags
ls
vi dinakar.pem
ssh -i dinakar.pem dinakar@3.109.225.212
chmod 400 dinakar.pem
ssh -i dinakar.pem dinakar@3.109.225.212
ls
cp dinakar.pem /tmp
cd /tmp
chmod 777 dinakar.pem 
ssh -i dinakar.pem dinakar@3.109.225.212
cd ..
cd /root/
ssh -i dinakar.pem dinakar@3.109.225.212
ssh -L 3000:0.0.0.0:3000 s_01ks4z879n5d5nmq2amw4z6jd3@ssh.lightning.ai
ssh -L 3000:0.0.0.0:3000 ssh s_01ks57z5vr4966j2trf8bpp356@ssh.lightning.ai
ssh -L 3000:0.0.0.0:3000 s_01ks57z5vr4966j2trf8bpp356@ssh.lightning.ai
netstat -tnlp
ssh -N -L 3000:localhost:3000 s_01ks57z5vr4966j2trf8bpp356@ssh.lightning.ai
ssh -N -L 3000:lo0.0.0.0000 s_01ks57z5vr4966j2trf8bpp356@ssh.lightning.ai
ssh -N -L 3000:0.0.0.0:3000 s_01ks57z5vr4966j2trf8bpp356@ssh.lightning.ai
ssh s_01ks57z5vr4966j2trf8bpp356@ssh.lightning.ai
ssh s_01ks56rz6z5n2b3j8zthwnhn29@ssh.lightning.ai
ssh s_01ks57950y5nc3xrmqxc2yawfh@ssh.lightning.ai
ssh s_01ks57z5vr4966j2trf8bpp356@ssh.lightning.ai
ssh s_01ks7400cg33tz51jkxqhx8gn8@ssh.lightning.ai
netstat -tnlp
curl http://localhost:3000/api/tags
curl http://localhost:3000/api/generate -d "{\"model\":\"qwen3:14b\",\"prompt\":\"hello\",\"stream\":false}"
ls
ssh -i dinakar.pem dinakar@3.109.225.212
ssh -N -L 3000:0.0.0.0:3000 s_01ks7400cg33tz51jkxqhx8gn8@ssh.lightning.ai
ssh -N -L 3000:localhost:3000 s_01ks7400cg33tz51jkxqhx8gn8@ssh.lightning.ai
ssh s_01ks57z5vr4966j2trf8bpp356@ssh.lightning.ai
ssh s_01ks7qbbf11vbb47s6sgmmds5b@ssh.lightning.ai
curl -fsSL https://ollama.com/install.sh | sh
ssh s_01ks7qbbf11vbb47s6sgmmds5b@ssh.lightning.ai
