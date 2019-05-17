<% if $Results %>
    <div class="searchresults">
        <div class="searchresults__header">
            <h2 class="searchresults__info h3">
                {$Results.Count} results for "{$SearchQuery}"
            </h2>

            <p class="searchresults__page">
                Page {$Results.CurrentPage} of {$Results.TotalPages}
            </p>
        </div>

        <div class="searchresults__list">
            <% loop $Results %>
                <a href="$Link" class="searchresults__item">
                    <h2 class="searchresults__title h5">$Title</h2>
                    <div class="searchresults__content">$Description</div>
                </a>
            <% end_loop %>
        </div>

        <% if $Results.MoreThanOnePage %>
            <div class="searchresults__pagination">
                <% loop $Results.Pages %>
                    <% if $Pos = $Up.CurrentPage %>
                        <span class="searchresults__pagination-link searchresults__pagination-link--current">$Pos</span>
                    <% else %>
                        <a href="$Link" class="searchresults__pagination-link">$Pos</a>
                    <% end_if %>
                <% end_loop %>
            </div>
        <% end_if %>
    </div>
<% else %>
    <div class="searchresults searchresults--none">
        <h1 class="h4">Sorry, we could not find any results for "{$SearchQuery}"</h1>
        <br><br>
        <a href="/" class="button">Go to Homepage</a>
    </div>
<% end_if %>